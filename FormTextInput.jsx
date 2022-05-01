import React, { useState } from "react";
import { TextInput, Text, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function FormTextInput({ icon, error, touched, ...otherProps }) {
  //   const [validationColor, setValidationColor] = useState("#223e4b");
  //   !touched
  //     ? setValidationColor("#223e4b")
  //     : error
  //     ? setValidationColor("#FF5A5F")
  //     : setValidationColor("#223e4b");

  const validationColor = !touched ? "#223e4b" : error ? "#FF5A5F" : "#223e4b";
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 48,
          borderRadius: 8,
          borderColor: validationColor,
          borderWidth: StyleSheet.hairlineWidth,
          padding: 8
        }}
      >
        <View style={{ padding: 8 }}>
          <MaterialIcons name={icon} color={validationColor} size={16} />
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            underlineColorAndroid="transparent"
            placeholderTextColor="rgba(34, 62, 75, 0.7)"
            {...otherProps}
          />
        </View>
      </View>
      {!touched ? null : error ? (
        <Text style={{ color: "#FF5A5F", fontWeight: "bold" }}>{error}</Text>
      ) : null}
    </View>
  );
}

// const styles = StyleSheet.create({
//   textInputWrapper:
// });
