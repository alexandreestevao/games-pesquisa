import React, { useState, useEffect } from 'react';
import { FontAwesome5 as Icon } from '@expo/vector-icons';
import { StyleSheet, View, TextInput, Text, Alert } from 'react-native';
import Header from '../../components/Header';
import PlatformCard from './PlatformCard';
import { GamePlatform, Game } from './types';
import RNPickerSelect from 'react-native-picker-select';
import Axios from 'axios';
import { RectButton } from 'react-native-gesture-handler';

const placeholder = {
  label: 'Selecione o game',
  value: null
}

const BASE_URL = 'http://192.168.169.107:8080';

const mapSelectValues = (games: Game[]) => {
  return games.map(game => ({
    ...game,
    label: game.title,
    value: game.id
  }));
}

const CreateRecord = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [platform, setPlatform] = useState<GamePlatform>();
  const [selectedGame, setSelectedGame] = useState('');
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [filterredGames, setFilterredGames] = useState<Game[]>([]);

  const handlerChangePlatform = (selectedPlatform: GamePlatform) => {
    setPlatform(selectedPlatform);
    const gamesByPlatform = allGames.filter(
      game => game.platform === selectedPlatform
    )
    setFilterredGames(gamesByPlatform);
  }

  const handlerSubmit = () => {
    const payload = ({name, age, gameId: selectedGame});
    Axios.post(`${BASE_URL}/records`, payload)
      .then(() => {
        Alert.alert('Dados salvos com sucesso!');
        setName('');
        setAge('');
        setSelectedGame('');
        setPlatform(undefined);
      })
      .catch(() => Alert.alert('Erro ao salvar informações!'));
  }

  useEffect(() => {
    Axios.get(`${BASE_URL}/games`)
      .then(response => {
        const selectValues = mapSelectValues(response.data);
        console.log(selectValues)
        setAllGames(selectValues);
      })
      .catch(() => Alert.alert('Erro ao listar os jogos!'));
  }, []);

    return (
        <>

        <View style={styles.container}>
            <TextInput 
                style={styles.inputText} 
                placeholder="Nome"
                placeholderTextColor="#9e9e9e"
                onChangeText={text => setName(text)}
                value={name}
            />
            <TextInput 
                keyboardType="numeric"
                style={styles.inputText} 
                placeholder="Idade"
                placeholderTextColor="#9e9e9e"
                maxLength={3}
                onChangeText={text => setAge(text)}
                value={age}
            />	
            <View style={styles.platformContainer}>
              <PlatformCard  
                platform="PC"
                icon="laptop"
                onChange={handlerChangePlatform}
                activePlatform={platform}
              />
              <PlatformCard  
                platform="XBOX"
                icon="xbox"
                onChange={handlerChangePlatform}
                activePlatform={platform}
              />
              <PlatformCard  
                platform="PLAYSTATION"
                icon="playstation"
                onChange={handlerChangePlatform}
                activePlatform={platform}
              />
            </View>  
            <RNPickerSelect 
              onValueChange={value => {
              setSelectedGame(value)
              }}
              placeholder={placeholder} 
              value={selectedGame}
              items={filterredGames}
              style={pickerSelectStyles}
              Icon={() => {
              return <Icon name="chevron-down" color="#9e9e9e" size={25} />
              }}
            />  
            <View style={styles.footer}>
              <RectButton style={styles.button} onPress={handlerSubmit}>
                <Text style={styles.buttonText}>
                  SALVAR
                </Text>
              </RectButton>
            </View>
        </View>        
        </>
    );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    color: '#ED7947',
    paddingRight: 30,
    fontFamily: "Play_700Bold",
    height: 50
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    color: '#ED7947',
    paddingRight: 30,
    fontFamily: "Play_700Bold",
    height: 50
  },
  placeholder: {
    color: '#9E9E9E',
    fontSize: 16,
    fontFamily: "Play_700Bold",
  },
  iconContainer: {
    top: 10,
    right: 12,
  }
})

const styles = StyleSheet.create({
    container: {
      marginTop: '15%',
      paddingRight: '5%',
      paddingLeft: '5%',
      paddingBottom: 50
    },
    inputText: {
      height: 50,
      backgroundColor: '#FFF',
      borderRadius: 10,
      color: '#ED7947',
      fontFamily: "Play_700Bold",
      fontSize: 16,
      paddingLeft: 20,
      marginBottom: 21
    },
    platformContainer: {
      marginBottom: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    footer: {
      marginTop: '15%',
      alignItems: 'center',
    },
    button: {
      backgroundColor: '#00D4FF',
      flexDirection: 'row',
      borderRadius: 10,
      height: 60,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonText: {
      fontFamily: "Play_700Bold",
      fontWeight: 'bold',
      fontSize: 18,
      color: '#0B1F34',
    }
  });

export default CreateRecord;