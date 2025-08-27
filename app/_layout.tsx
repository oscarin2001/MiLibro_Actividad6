import { Stack, Link } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { useEffect } from 'react';
import { initDB } from '../lib/db';

export default function RootLayout() {
  useEffect(() => {
    initDB().catch(() => {
      // swallow init errors; screens will surface specific errors on use
    });
  }, []);
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Buscar Libros',
          headerRight: () => (
            <Link href={{ pathname: '/favorites' } as any} asChild>
              <Pressable style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
                <Text style={{ color: '#1e90ff', fontWeight: '600' }}>Favoritos</Text>
              </Pressable>
            </Link>
          ),
        }}
      />
      <Stack.Screen name="book/[id]" options={{ title: 'Detalles', presentation: 'modal' }} />
      <Stack.Screen name="favorites" options={{ title: 'Favoritos' }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
