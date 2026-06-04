import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from "react";
import {
  Alert,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function AddEventsScreen() {
  const [nome, setNome] = useState("");
  const [bandas, setBandas] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [cidade, setCidade] = useState("");
  const [local, setLocal] = useState("");
  const [descricao, setDescricao] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Substitua pelo endereço do seu servidor backend
  const API_URL = 'http://seu-servidor-api:3000';

  const abrirSeletorData = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: new Date(),
        mode: 'date',
        is24Hour: true,
        onChange: (event, selectedDate) => {
          if (selectedDate) {
            const dia = String(selectedDate.getDate()).padStart(2, '0');
            const mes = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const ano = selectedDate.getFullYear();
            const dataFormatada = `${dia}/${mes}/${ano}`;
            setData(dataFormatada);
          }
        }
      });
    } else {
      setShowDatePicker(true);

    }
  };

  const abrirSeletorHorario = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: new Date(),
        mode: 'time',
        is24Hour: true,
        onChange: (event, selectedTime) => {
          if (selectedTime) {
            const horas = String(
              selectedTime.getHours()
            ).padStart(2, '0');
            const minutos = String(
              selectedTime.getMinutes()
            ).padStart(2, '0');
            const horarioFormatado =
              `${horas}:${minutos}`;
            setHorario(horarioFormatado);
          }
        }
      });

    } else {
      setShowTimePicker(true);
    }
  };

  async function adicionarEvento() {

    if (!nome || !bandas || !data || !horario || !cidade || !local || !descricao) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/eventos`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome,
            bandas,
            data,
            horario,
            cidade,
            local,
            descricao,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao salvar');
      }

      setNome("");
      setBandas("");
      setData("");
      setHorario("");
      setCidade("");
      setLocal("");
      setDescricao("");

      Keyboard.dismiss();

      Alert.alert(
        "Sucesso",
        "Evento adicionado!"
      );

    } catch (error) {

      Alert.alert(
        "Erro",
        "Não foi possível salvar o evento."
      );

      console.log(error);

    }
  }

  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.mainBackground}
      resizeMode="cover">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView>
          <ScrollView contentContainerStyle={styles.container}>

            <Text style={styles.title}>Adicionar evento</Text>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Nome do Evento"
                value={nome}
                onChangeText={setNome}
              />

              <TextInput
                style={styles.input}
                placeholder="Bandas"
                value={bandas}
                onChangeText={setBandas}
              />

              {/* Campo que abre o picker ao clicar */}
              <Pressable
                style={styles.input}
                onPress={abrirSeletorData}>
                <Text
                  style={{ color: data ? '#000' : '#777' }}>
                  {data || 'DD/MM/AAAA'}
                </Text>
              </Pressable>

              {showDatePicker && Platform.OS === 'ios' && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      const dia = String(selectedDate.getDate()).padStart(2, '0');
                      const mes = String(selectedDate.getMonth() + 1).padStart(2, '0');
                      const ano = selectedDate.getFullYear();
                      const dataFormatada = `${dia}/${mes}/${ano}`;
                      setData(dataFormatada);
                      setShowDatePicker(false);
                    }
                  }}
                />
              )}

              <Pressable
                style={styles.input}
                onPress={abrirSeletorHorario}>
                <Text
                  style={{ color: horario ? '#000' : '#777' }}>
                  {horario || '00:00'}
                </Text>
              </Pressable>

              {showTimePicker && Platform.OS === 'ios' && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  display="spinner"
                  is24Hour={true}
                  onChange={(event, selectedTime) => {
                    if (selectedTime) {
                      const horas = String(
                        selectedTime.getHours()
                      ).padStart(2, '0');
                      const minutos = String(
                        selectedTime.getMinutes()
                      ).padStart(2, '0');
                      const horarioFormatado =
                        `${horas}:${minutos}`;
                      setHorario(horarioFormatado);
                      setShowTimePicker(false);
                    }
                  }}
                />
              )}

              <TextInput
                style={styles.input}
                placeholder="Cidade"
                value={cidade}
                onChangeText={setCidade}
              />

              <TextInput
                style={styles.input}
                placeholder="Local do evento"
                value={local}
                onChangeText={setLocal}
              />

              <TextInput
                style={styles.textArea}
                placeholder="Descrição do evento"
                value={descricao}
                multiline
                numberOfLines={10}
                onChangeText={setDescricao}
              />

              <TouchableOpacity style={styles.button} onPress={adicionarEvento}>
                <Text style={styles.buttonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>

  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },

  mainBackground: {
    flex: 1,
  },

  title: {
    fontFamily: 'MetalMania_400Regular',
    fontSize: 32,
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFF',
  },

  form: {
    backgroundColor: '#2A2A2A',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },

  input: {
    borderWidth: 1,
    borderColor: "#1A1A1A",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff'
  },

  button: {
    backgroundColor: "#E50914",
    padding: 15,
    borderRadius: 8
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16
  },

  textArea: {
    borderWidth: 1,
    borderColor: "#1A1A1A",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    minHeight: 120,
    textAlignVertical: 'top',
  },
});