import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Button, ActivityIndicator, Alert } from 'react-native';
import { getBookById, GoogleBook } from '../../lib/api';
import { addFavorite, getFavoriteById, initDB, isFavorite, removeFavorite } from '../../lib/db';

export default function BookDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [book, setBook] = useState<GoogleBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fav, setFav] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        await initDB();
        const data = await getBookById(String(id));
        setBook(data);
        if (data?.id) setFav(await isFavorite(data.id));
      } catch (e: any) {
        setError(e?.message || 'Error al cargar el libro');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onToggleFavorite = async () => {
    if (!book) return;
    try {
      if (fav) {
        await removeFavorite(book.id);
        setFav(false);
      } else {
        const v = book.volumeInfo || {};
        await addFavorite({
          id: book.id,
          title: v.title,
          authors: (v.authors || []).join(', '),
          thumbnail: v.imageLinks?.thumbnail || v.imageLinks?.smallThumbnail,
          publishedDate: v.publishedDate,
          description: v.description,
        });
        setFav(true);
        Alert.alert('Guardado', 'Libro añadido a Favoritos');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'No se pudo actualizar Favoritos');
    }
  };

  if (loading) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator />
    </View>
  );

  if (error) return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ color: 'red' }}>{error}</Text>
    </View>
  );

  if (!book) return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>No se encontró el libro.</Text>
      <Button title="Volver" onPress={() => router.back()} />
    </View>
  );

  const v = book.volumeInfo || {};
  const thumb = v.imageLinks?.thumbnail || v.imageLinks?.smallThumbnail;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        {thumb ? (
          <Image source={{ uri: thumb }} style={{ width: 120, height: 160, borderRadius: 6, backgroundColor: '#eee' }} />
        ) : (
          <View style={{ width: 120, height: 160, borderRadius: 6, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }}>
            <Text>📖</Text>
          </View>
        )}
      </View>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>{v.title || 'Sin título'}</Text>
      {!!v.authors?.length && <Text style={{ marginTop: 4, color: '#555' }}>{v.authors.join(', ')}</Text>}
      {!!v.publishedDate && <Text style={{ marginTop: 4 }}>Publicado: {v.publishedDate}</Text>}

      <View style={{ height: 12 }} />
      {!!v.description && <Text style={{ lineHeight: 20 }}>{v.description}</Text>}

      <View style={{ height: 24 }} />
      <Button title={fav ? 'Quitar de Favoritos' : 'Añadir a Favoritos'} onPress={onToggleFavorite} />
    </ScrollView>
  );
}
