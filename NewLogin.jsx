import React, { useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import FormButton from "./FormButton";
import FormTextInput from "./FormTextInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import { useNavigation } from "@react-navigation/native";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { Modalize } from "react-native-modalize";

export default function NewLogin() {
  //   const { handleChange, handleSubmit, handleBlur, values, errors, touched } =
  //     useFormik({
  //       validationSchema: LoginSchema,
  //       initialValues: { email: "", password: "" },
  //       onSubmit: (values) =>
  //         alert(`Email: ${values.email}, Password: ${values.password}`)
  //     });
  const { user, setUser } = useContext(UserContext);
  const auth = getAuth();
  const navigation = useNavigation();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(2, "Too Short!")
      .max(10, "Too Long!")
      .required("Required")
  });

  const formik = useFormik({
    initialValues: { email: "z@g.com", password: "qwerty" },
    validationSchema: LoginSchema,
    onSubmit: (values) =>
      signInWithEmailAndPassword(
        auth,
        formik.values.email,
        formik.values.password
      )
        .then((userCredential) => {
          // Signed in
          console.log("-----------------USER set to", userCredential.user);
          setUser(userCredential.user);
        })
        .catch((error) => {
          console.log(error);
        })
    // alert(`Email: ${values.email}, Password: ${values.password}`)
  });

  return (
    <View style={styles.loginWrapper}>
      <Text style={styles.formName}>Login</Text>

      <View style={styles.inputWrapper}>
        <FormTextInput
          icon="mail"
          onChangeText={formik.handleChange("email")}
          placeholder="Enter your email"
          autoCapitalize="none"
          autoCompleteType="email"
          keyboardType="email-address"
          keyboardAppearance="dark"
          returnKeyType="next"
          returnKeyLabel="next"
          validateOnBlur
          onBlur={formik.handleBlur("email")}
          error={formik.errors.email}
          touched={formik.touched.email}
          value={formik.values.email}
        />

        {/* {formik.errors.email &&  ? <Text>{formik.errors.email}</Text> : null} */}
      </View>

      <View style={styles.inputWrapper}>
        <FormTextInput
          icon="vpn-key"
          onChangeText={formik.handleChange("password")}
          placeholder="Enter your password"
          secureTextEntry
          autoCompleteType="password"
          autoCapitalize="none"
          keyboardAppearance="dark"
          returnKeyType="go"
          returnKeyLabel="go"
          onBlur={formik.handleBlur("password")}
          error={formik.errors.password}
          touched={formik.touched.password}
          value={formik.values.password}
        />
      </View>

      <FormButton label="Login" onPress={formik.handleSubmit} />
      <Text>Don't have an account?</Text>
      <TouchableOpacity onPress={() => navigation.jumpTo("Register")}>
        <Text style={styles.blue}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loginWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  formName: { color: "#223e4b", fontSize: 20, marginBottom: 16 },
  inputWrapper: {
    paddingHorizontal: 32,
    marginBottom: 16,
    width: "100%"
  },
  blue: {
    color: "#607D8B"
  }
});
