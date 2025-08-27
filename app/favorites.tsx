import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Button, RefreshControl, Alert } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { FavoriteBook, listFavorites, removeFavorite } from '../lib/db';

export default function FavoritesScreen() {
  const [items, setItems] = useState<FavoriteBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listFavorites();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const onRemove = async (id: string) => {
    try {
      await removeFavorite(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'No se pudo eliminar');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <Link href={{ pathname: '/book/[id]' as any, params: { id: item.id } }} asChild>
            <TouchableOpacity style={{ flexDirection: 'row', paddingVertical: 10, gap: 12, alignItems: 'center' }}>
              {item.thumbnail ? (
                <Image source={{ uri: item.thumbnail }} style={{ width: 50, height: 70, borderRadius: 4, backgroundColor: '#eee' }} />
              ) : (
                <View style={{ width: 50, height: 70, borderRadius: 4, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }}>
                  <Text>📖</Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600' }}>{item.title || 'Sin título'}</Text>
                {!!item.authors && <Text style={{ color: '#555' }} numberOfLines={1}>{item.authors}</Text>}
              </View>
              <View>
                <Button title="Quitar" onPress={() => onRemove(item.id)} />
              </View>
            </TouchableOpacity>
          </Link>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
        ListEmptyComponent={!loading ? <Text>No has guardado favoritos aún.</Text> : null}
      />
    </View>
  );
}
