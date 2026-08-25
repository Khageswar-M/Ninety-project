import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStyles } from "../../../hook/useThemeStyles";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { storage } from "../../../utils/storage";
import { useDispatch } from "react-redux";
import { login } from "../../../API/auth/authApi";
import { setLogin } from "../../../redux/slices/appSlice";

const Login = () => {
  const styles = useAuthStyles();
  const inset = useSafeAreaInsets();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log(remember);

  useEffect(() => {
   const loadRememberedUser = async() => {
    try{
      const rememberedData = await storage.get("remember");

      if(rememberedData?.wasRemember){
        setEmail(rememberedData.wasEmail || "");
        setPassword(rememberedData.wasPassword || "");
        setRemember(true);
      }
    }catch(error){
      console.error("Remember data error: ", error);
    }
   }

   loadRememberedUser();
  },[]);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Invalid email or password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await login(trimmedEmail, trimmedPassword);

      if (response.data.success) {
        const {
          id,
          fullName,
          email: userEmail,
          jwtToken,
          challenges,
        } = response.data.data;

        const user = {
          id,
          fullName,
          email: userEmail, 
          jwtToken,
          challenges: challenges.map((challenge) => ({
            id: challenge.id,
            title: challenge.title,
            dayGrid: challenge.dayGrid,
            currentDay: challenge.currentDay,
            currentStreakCount: challenge.currentStreak,
            completedCount: challenge.completedCount,
            startedAt: challenge.startedAt,
            completed: challenge.completed,
          })),
        };

        await storage.set("@ninety_user", user);

        if(remember){
          const rememberObj = {
            wasRemember: true,
            wasEmail: user.email,
            wasPassword: password
          };
          await storage.set("remember", rememberObj);
        }

        dispatch(setLogin(true));
      } else {
        setError(response.data.message || "Invalid email or password");
      }
    } catch (e) {
      console.log(e);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      enableAutomaticScroll={true}
      enableResetScrollToCoords={true}
      enableOnAndroid={true}
      keyboardOpeningTime={20}
      style={[styles.loginContainer, { paddingTop: inset.top }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Ninety Productive Day's Tracker</Text>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Login to continue your 90-day journey.
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#888" />
          <TextInput
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.loginInput}
            placeholderTextColor="#999"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" />
          <TextInput
            placeholder="Password"
            secureTextEntry={hidePassword}
            value={password}
            onChangeText={setPassword}
            style={styles.loginInput}
            placeholderTextColor="#999"
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
            <Ionicons
              name={hidePassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Remember */}
        <View style={styles.row}>
          <View style={styles.checkboxRow}>
            <Checkbox
              value={remember}
              onValueChange={setRemember}
              color={remember ? "#FF6F00" : undefined}
            />
            <Text style={styles.remember}>Remember Me</Text>
          </View>

          <TouchableOpacity onPress={() => router.push("(auth)/ForgetPassword")}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Login */}
        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.loginText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom */}
      <View style={styles.bottom}>
        <Text style={styles.bottomText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push("(auth)/SignUpPage")}>
          <Text style={styles.signup}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Login;