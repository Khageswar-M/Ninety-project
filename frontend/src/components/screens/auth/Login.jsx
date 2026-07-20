import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,

} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStyles } from "../../../hook/useThemeStyles";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Login = () => {
  const styles = useAuthStyles();
  const inset = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={50}
      contentContainerStyle={[
        styles.loginContainer,
        { paddingTop: inset.top, }
      ]}

    >
      {/* Header */}

      <View style={styles.header}>
        <Text style={styles.logo}>Ninety</Text>

        <Text style={styles.title}>
          Welcome Back
        </Text>

        <Text style={styles.subtitle}>
          Login to continue your 90-day journey.
        </Text>
      </View>

      {/* Form */}

      <View style={styles.form}>

        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={20}
            color="#888"
          />

          <TextInput
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.loginInput}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#888"
          />

          <TextInput
            placeholder="Password"
            secureTextEntry={hidePassword}
            value={password}
            onChangeText={setPassword}
            style={styles.loginInput}
            placeholderTextColor="#999"
          />

          <TouchableOpacity
            onPress={() =>
              setHidePassword(!hidePassword)
            }
          >
            <Ionicons
              name={
                hidePassword
                  ? "eye-off-outline"
                  : "eye-outline"
              }
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Remember */}

        <View style={styles.row}>
          <View style={styles.checkboxRow}>
            <Checkbox
              value={remember}
              onValueChange={setRemember}
              color={remember ? "#FF6F00" : undefined}
            />

            <Text style={styles.remember}>
              Remember Me
            </Text>
          </View>

          <TouchableOpacity>
            <Text style={styles.forgot}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login */}

        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>
            Login
          </Text>
        </TouchableOpacity>

        {/* Divider */}

        <View style={styles.loginDividerRow}>
          <View style={styles.divider} />
          <Text style={styles.or}>OR</Text>
          <View style={styles.divider} />
        </View>

        {/* Google */}

        <TouchableOpacity style={styles.loginGoogleButton}>
          <Ionicons
            name="logo-google"
            size={22}
            color="#EA4335"
          />

          <Text style={styles.loginGoogleText}>
            Continue with Google
          </Text>
        </TouchableOpacity>

      </View>

      {/* Bottom */}

      <View style={styles.bottom}>
        <Text style={styles.bottomText}>
          Don't have an account?
        </Text>

        <TouchableOpacity
          onPress={() => router.push("(auth)/SignUpPage")}
        >
          <Text style={styles.signup}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>

    </KeyboardAwareScrollView>
  );
};

export default Login;