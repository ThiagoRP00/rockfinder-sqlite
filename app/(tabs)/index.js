import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function SearchScreen() {
  const router = useRouter();

  const [eventos, setEventos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [eventosFiltrados, setEventosFiltrados] = useState([]);

  // Substitua pelo endereço do seu servidor backend
  const API_URL = 'http://seu-servidor-api:3000';

  useEffect(() => {
    carregarEventos();
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarEventos();
    }, [])
  );

  useEffect(() => {
    filtrarEventos();
  }, [pesquisa, eventos]);

  const carregarEventos = async () => {
    try {
      const response = await fetch(
        `${API_URL}/eventos`
      );
      const dados = await response.json();
      setEventos(dados);
    } catch (error) {
      Alert.alert(
        "Erro", "Não foi possível carregar os eventos."
      );

    }
  };

  const filtrarEventos = () => {
    if (pesquisa.trim() === "") {
      setEventosFiltrados(eventos);
    } else {
      const filtrados = eventos.filter((evento) => {
        const texto = pesquisa.toLowerCase();
        return (
          evento.nome.toLowerCase().includes(texto) ||
          evento.bandas.toLowerCase().includes(texto) ||
          evento.cidade.toLowerCase().includes(texto) ||
          evento.local.toLowerCase().includes(texto)
        );
      });
      setEventosFiltrados(filtrados);
    }
  }

  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.mainBackground}
      resizeMode="cover">
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}>

          <Text style={styles.logo}>Rock<Text style={{ color: '#E50914' }}>Finder</Text></Text>

          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#B3B3B3" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por evento, banda ou local..."
              placeholderTextColor="#B3B3B3"
              value={pesquisa}
              onChangeText={setPesquisa}
            />
          </View>

          <Text style={styles.resultsCount}>{eventosFiltrados.length} eventos encontrados</Text>

          {eventosFiltrados.length > 0 ? (
            eventosFiltrados.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.eventCard}
                onPress={() =>
                  router.push(`/event/${item.id}`)
                }
              >
                <Text style={styles.eventCardTitle}>{item.nome}</Text>
                <Text style={styles.eventCardBands}>{item.bandas}</Text>
                <Text style={styles.eventCardInfo}><Ionicons name="calendar" size={12} color="#B3B3B3" /> {item.data.trim()} - {item.horario.trim()}</Text>
                <Text style={styles.eventCardInfo}><Ionicons name="location-sharp" size={12} color="#B3B3B3" /> {item.local.trim()} - {item.cidade.trim()}</Text>

              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ color: '#FFF', textAlign: 'center', marginTop: 20 }}>
              Nenhum evento encontrado
            </Text>
          )}

        </ScrollView>
      </SafeAreaView>
    </ImageBackground >

  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  mainBackground: {
    flex: 1,
  },

  logo: {
    fontSize: 52,
    color: '#fff',
    fontFamily: 'MetalMania_400Regular',
    textAlign: 'center',
    width: '100%',
  },

  // Container da barra de busca
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 18,
  },

  // Input de busca
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
  },

  // Contagem de eventos encontrados
  resultsCount: {
    color: '#B3B3B3',
    fontSize: 14,
    marginLeft: 16,
    marginBottom: 10,
  },

  eventCard: {
    padding: 16,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#E50914',
    gap: 3,
  },

  eventCardTitle: {
    color: '#E50914',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  eventCardBands: {
    color: '#FFF',
    fontSize: 15,

  },

  eventCardInfo: {
    color: '#B3B3B3'
  },
});