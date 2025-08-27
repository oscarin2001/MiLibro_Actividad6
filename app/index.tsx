import { useState } from 'react';
import { View, TextInput, Button, FlatList, Image, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { searchBooks, GoogleBook } from '../lib/api';

export default function IndexScreen() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<GoogleBook[]>([]);

  const onSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchBooks(query);
      setResults(data);
    } catch (e: any) {
      setError(e?.message || 'Error al buscar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Busca por título, autor..."
          style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, height: 44 }}
          returnKeyType="search"
          onSubmitEditing={onSearch}
        />
        <Button title="Buscar" onPress={onSearch} />
      </View>

      {loading && (
        <View style={{ paddingVertical: 16 }}>
          <ActivityIndicator />
        </View>
      )}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const v = item.volumeInfo || {};
          const thumb = v.imageLinks?.thumbnail || v.imageLinks?.smallThumbnail;
          const authors = v.authors?.join(', ');
          return (
            <Link href={{ pathname: '/book/[id]' as any, params: { id: item.id } }} asChild>
              <TouchableOpacity style={{ flexDirection: 'row', paddingVertical: 10, gap: 12, alignItems: 'center' }}>
                {thumb ? (
                  <Image source={{ uri: thumb }} style={{ width: 50, height: 70, borderRadius: 4, backgroundColor: '#eee' }} />
                ) : (
                  <View style={{ width: 50, height: 70, borderRadius: 4, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }}>
                    <Text>📖</Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600' }}>{v.title || 'Sin título'}</Text>
                  <Text style={{ color: '#555' }} numberOfLines={1}>{authors || 'Autor desconocido'}</Text>
                </View>
              </TouchableOpacity>
            </Link>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
        ListEmptyComponent={!loading ? <Text>No hay resultados</Text> : null}
      />
    </View>
  );
}
