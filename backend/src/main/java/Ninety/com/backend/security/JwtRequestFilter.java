package Ninety.com.backend.security;

import Ninety.com.backend.service.AppUserDetailsService;
import Ninety.com.backend.utils.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtRequestFilter extends OncePerRequestFilter {

    private final AppUserDetailsService appUserDetailsService;
    private final JwtUtil jwtUtil;

    private final List<String> PUBLIC_URLS = List.of(
            "/api/v1/auth/",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/v3/api-docs/**",
            "/actuator/health",
            "/api/v1/users/exists"
    );

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {


        String path = request.getServletPath();

        System.out.println("Requested path is: " + path);

//        boolean isPublic = PUBLIC_URLS.stream()
//                .anyMatch(url -> path.startsWith(url));

        boolean isPublic = PUBLIC_URLS.stream()
                .anyMatch(path::startsWith);

        if (isPublic) {
            filterChain.doFilter(request, response);
            return;
        }
        log.info("/api/v1/auth/send-otp executes ");

        String jwt = null;
        String email = null;

        // 1. Check the authorization header
        final String authorizationHeader = request.getHeader("Authorization");
        if(authorizationHeader != null && authorizationHeader.startsWith("Bearer ")){
            jwt = authorizationHeader.substring(7);
        }

        // 2. If not found in header, check cookies
        if(jwt == null){
            Cookie[] cookies = request.getCookies();
            if(cookies != null){
                for(Cookie cookie : cookies){
                    if("jwt".equals(cookie.getName())){
                        jwt = cookie.getValue();
                        break;
                    }
                }
            }
        }


        // 3. Validate the token and set the security context
        if(jwt != null){
            email = jwtUtil.extractEmail(jwt);
            if(email != null && SecurityContextHolder.getContext().getAuthentication() == null){
                UserDetails userDetails = appUserDetailsService.loadUserByUsername(email);

                try{
                    if(jwtUtil.validateToken(jwt, userDetails)){
                        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

                    }
                }catch(ExpiredJwtException e){
                    sendUnauthorizedResponse(
                            response,
                            "Your session has expired. Please login again."
                    );
                    return;

                }catch (JwtException e){
                    sendUnauthorizedResponse(
                            response,
                            "Invalid authentication token. Please login again."
                    );

                    return;
                }

            }
        }

        filterChain.doFilter(request, response);

    }

    protected void sendUnauthorizedResponse(
            HttpServletResponse response,
            String message
    ) throws IOException{
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");

        response.getWriter().write("""
                {
                    
                    "success" : false,
                    "status" : 401,
                    "error" : "Unauthorized",
                    "message" : "%s"
                }
                """.formatted(message));
    }
}
