package Ninety.com.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "settings")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Settings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    @Column(nullable = false)
    private Integer challengeResetCount = 0;

    @Builder.Default
    @Column(nullable = false)
    private Boolean dailyReminder = true;

    @Builder.Default
    @Column(nullable = false)
    private String reminderTime = "2026-08-31T15:30:00.000Z";

    @Builder.Default
    @Column(nullable = false)
    private Boolean aiCoach = true;

    @Builder.Default
    @Column(nullable = false)
    private Boolean milestoneAlert = true;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Theme theme = Theme.DARK;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}