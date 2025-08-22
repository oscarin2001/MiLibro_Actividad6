import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';

export default function ClimaScreen() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Nota: considera mover esta API key a variables de entorno más adelante
  const API_KEY = 'ebefed9b4bb9f408acae77a5b494b0f9';

  const getWeather = async () => {
    if (!city.trim()) {
      Alert.alert('Error', 'Por favor ingresa una ciudad');
      return;
    }

    setLoading(true);
    setWeather(null);
    console.log('Buscando clima para la ciudad:', city);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=es`
      );

      console.log('Código de respuesta:', response.status);

      if (!response.ok) {
        throw new Error('Ciudad no encontrada o error en la API');
      }

      const data = await response.json();
      console.log('Datos recibidos:', data);

      setWeather(data);
    } catch (error: any) {
      console.error('Error al obtener el clima:', error);
      Alert.alert('Error', error?.message ?? 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.paw}>🐾</Text>
          <Text style={styles.title}>Clima Salvaje</Text>
          <Text style={styles.paw}>🐾</Text>
        </View>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            placeholder="Ingresa el nombre de la ciudad"
            placeholderTextColor="#6b6b6b"
            value={city}
            onChangeText={setCity}
            returnKeyType="search"
            onSubmitEditing={getWeather}
          />

          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={getWeather} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Buscar</Text>
            )}
          </TouchableOpacity>
        </View>

        {loading && !weather && (
          <View style={{ marginTop: 16 }}>
            <ActivityIndicator size="large" color="#6C4E31" />
          </View>
        )}

        {weather && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.city}>{weather.name}, {weather.sys?.country}</Text>
              <Text style={styles.animalIcon}>{pickAnimal(weather.weather?.[0]?.main)}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Temperatura</Text>
              <Text style={styles.value}>{Math.round(weather.main?.temp)}°C</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Sensación</Text>
              <Text style={styles.value}>{Math.round(weather.main?.feels_like)}°C</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Clima</Text>
              <Text style={styles.value}>
                {capitalize(weather.weather?.[0]?.description ?? '')}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Humedad</Text>
              <Text style={styles.value}>{weather.main?.humidity}%</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Viento</Text>
              <Text style={styles.value}>{weather.wind?.speed} m/s</Text>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Hecho con amor por los animalitos 🐻🐯🐼</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function pickAnimal(main: string | undefined) {
  switch (main) {
    case 'Thunderstorm':
      return '🦁'; // fuerte como un león
    case 'Drizzle':
    case 'Rain':
      return '🐧'; // lluvia fresca
    case 'Snow':
      return '🐻‍❄️';
    case 'Clear':
      return '🦅';
    case 'Clouds':
      return '🐼';
    default:
      return '🦊';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EFE7', // arena clara
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  paw: {
    fontSize: 22,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#3E2F1C', // marrón oscuro
    letterSpacing: 0.5,
  },
  searchBox: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CDBBA7',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FFF',
    color: '#1f1f1f',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#6C4E31', // madera
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  resultCard: {
    marginTop: 20,
    backgroundColor: '#E7F0DC', // verde selva suave
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C8D2BE',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  animalIcon: {
    fontSize: 28,
  },
  city: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3E2F1C',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  label: {
    color: '#5C4B3A',
    fontWeight: '600',
  },
  value: {
    color: '#1f1f1f',
    fontWeight: '700',
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingVertical: 12,
  },
  footerText: {
    color: '#6b6b6b',
  },
});
