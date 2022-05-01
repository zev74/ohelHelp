import React, { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Text, View, StyleSheet, Switch, TouchableOpacity } from "react-native";
import FormButton from "./FormButton";
import FormTextInput from "./FormTextInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { addDoc, collection, getFirestore, setDoc, doc } from "@firebase/firestore";

export default function NewRegister() {
    const { user, setUser } = useContext(UserContext);
    const [gender, setGender] = useState(false);
    const navigation = useNavigation();

    const toggleGender = () => setGender((previousState) => !previousState);

    const db = getFirestore();
    const auth = getAuth();
    const userCollectionRef = collection(db, "users");

    const RegisterSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().min(6, "Too Short!").required("Required"),
        title: Yup.string().required("Required"),
        firstName: Yup.string().required("Required").min(2),
        lastName: Yup.string().required("Required").min(3),
        gender: Yup.boolean().required("Required")
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            title: "",
            firstName: "",
            lastName: "",
            gender: gender
        },
        validationSchema: RegisterSchema,
        onSubmit: (values) => {
            createUserWithEmailAndPassword(auth, formik.values.email, formik.values.password)
                .then((userCredential) => {
                    // Signed in
                    console.log("sent");
                    console.log(userCredential.user);

                    setUser(userCredential.user);

                    setDoc(doc(userCollectionRef, userCredential.user.uid), {
                        uid: userCredential.user.uid,
                        email: userCredential.user.email,
                        title: formik.values.title,
                        firstName: formik.values.firstName,
                        lastName: formik.values.lastName,
                        gender: gender ? "female" : "male",
                        pushToken: "",
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });

                    console.log(userCredential.user.email);
                    console.log("sent");
                    console.log(userCredential.user);
                })
                .then(() => {
                    updateProfile(auth.currentUser, {
                        displayName: formik.values.title + " " + formik.values.lastName
                    })
                        .then(() => {
                            console.log("it wokred", displayName);
                        })
                        .catch((error) => {
                            console.log("it didnt work", error);
                        });
                })
                .catch((error) => {
                    console.log("thes is an error");
                    console.log(error);
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorMessage, errorCode);
                });
        }
    });

    return (
        <View style={styles.loginWrapper}>
            <Text style={styles.formName}>Register</Text>
            <View style={styles.inputWrapper}>
                <FormTextInput
                    icon='mail'
                    onChangeText={formik.handleChange("email")}
                    placeholder='Enter your email'
                    autoCapitalize='none'
                    autoCompleteType='email'
                    keyboardType='email-address'
                    keyboardAppearance='dark'
                    returnKeyType='next'
                    returnKeyLabel='next'
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
                    icon='vpn-key'
                    onChangeText={formik.handleChange("password")}
                    placeholder='Create a password'
                    secureTextEntry
                    autoCompleteType='password'
                    autoCapitalize='none'
                    keyboardAppearance='dark'
                    returnKeyType='go'
                    returnKeyLabel='go'
                    onBlur={formik.handleBlur("password")}
                    error={formik.errors.password}
                    touched={formik.touched.password}
                    value={formik.values.password}
                />
            </View>

            <View style={styles.inputWrapper}>
                <FormTextInput
                    icon='people'
                    onChangeText={formik.handleChange("title")}
                    placeholder='Choose a title'
                    autoCapitalize='none'
                    keyboardAppearance='dark'
                    returnKeyType='go'
                    returnKeyLabel='go'
                    onBlur={formik.handleBlur("title")}
                    error={formik.errors.title}
                    touched={formik.touched.title}
                    value={formik.values.title}
                />
            </View>

            <View style={styles.inputWrapper}>
                <FormTextInput
                    icon='person'
                    onChangeText={formik.handleChange("firstName")}
                    placeholder='Enter your First name'
                    autoCapitalize='none'
                    keyboardAppearance='dark'
                    returnKeyType='go'
                    returnKeyLabel='go'
                    onBlur={formik.handleBlur("firstName")}
                    error={formik.errors.firstName}
                    touched={formik.touched.firstName}
                    value={formik.values.firstName}
                />
            </View>
            <View style={styles.inputWrapper}>
                <FormTextInput
                    icon='person'
                    onChangeText={formik.handleChange("lastName")}
                    placeholder='Enter your Last name'
                    autoCapitalize='none'
                    keyboardAppearance='dark'
                    returnKeyType='go'
                    returnKeyLabel='go'
                    onBlur={formik.handleBlur("lastName")}
                    error={formik.errors.lastName}
                    touched={formik.touched.lastName}
                    value={formik.values.lastName}
                />
            </View>

            <View style={styles.genderContainer}>
                <Text style={styles.genderHeader}>Gender</Text>
                <View style={styles.genderSwitchView}>
                    <Text style={styles.genderType}>Male</Text>
                    <Switch style={styles.genderSwitch} value={gender} onValueChange={toggleGender} trackColor={{ false: "#81b0ff", true: "#FF647F" }} thumbColor={"#f4f3f4"} />
                    <Text style={styles.genderType}>Female</Text>
                </View>
            </View>

            <FormButton label='Register' onPress={formik.handleSubmit} />
            <Text>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.jumpTo("Login")}>
                <Text style={styles.blue}>Log in</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    genderContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        paddingHorizontal: 30,
        paddingVertical: 1,
        maxHeight: 66
    },
    genderSwitchView: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start"
    },
    genderHeader: {
        fontSize: 20,
        paddingTop: 5
    },
    genderType: {
        fontSize: 16,
        paddingTop: 12,
        paddingHorizontal: 10
    },
    genderSwitch: {},
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
