import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

export default function HAScreen() {
  const [url, setUrl] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadUrl = async () => {
        const savedUrl = await AsyncStorage.getItem('ha_url');
        setUrl(savedUrl || '');
      };
      loadUrl();
    }, [])
  );

  if (url === null) {
    return <ActivityIndicator style={styles.center} size="large" />;
  }

  if (url === '') {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Anh hai ơi, sang tab Cài Đặt nhập Link HA trước nhé!</Text>
      </View>
    );
  }

  // [Suy luận] Kiểm tra nền tảng để render cho chuẩn, né lỗi WebView trên Web
  if (Platform.OS === 'web') {
    return (
      <iframe 
        src={url} 
        style={{ flex: 1, width: '100%', height: '100%', border: 'none' }} 
        title="Home Assistant"
      />
    );
  }

  // Chạy trên điện thoại thật thì dùng cái này
  return <WebView source={{ uri: url }} style={{ flex: 1 }} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 16, fontWeight: 'bold' }
});