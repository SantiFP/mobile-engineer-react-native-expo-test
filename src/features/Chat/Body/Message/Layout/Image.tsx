import React from "react";
import { Image, StyleSheet, View } from "react-native";
import type { ImageMessageProps } from "../../../../../../types/types";
import { config } from "../../../../../api/config";

const ImageMessage: React.FC<ImageMessageProps> = ({ message }) => {
  if (!message.imageUrl) return null;

  const fullUrl = `${config.socketUrl}${message.imageUrl}`;
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: fullUrl }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

export default ImageMessage;

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
    alignSelf: "flex-start",
    maxWidth: "70%",
    minWidth: 120,
    backgroundColor: "#eee",
  },
  image: {
    width: "100%",
    aspectRatio: 0.7,
  },
});
