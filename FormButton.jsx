import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function formButton({ label, onPress }) {
  return (
    <TouchableOpacity
      style={styles.buttonStyles}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonText: { fontSize: 18, color: "white", textTransform: "uppercase" },
  buttonStyles: {
    borderRadius: 8,
    height: 50,
    width: 245,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000050"
  }
});
