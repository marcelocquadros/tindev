import React, { useState, useEffect} from 'react';
import { 
    View,
    StyleSheet, 
    Image, 
    TextInput,
    TouchableOpacity,
    Text,
    KeyboardAvoidingView, 
    Platform
} from 'react-native';

import AsycStorage from '@react-native-community/async-storage';


import logo from '../assets/logo.png';
import api from '../services/api';

export default function Login({ navigation }) {

    const [ username, setUsername ] = useState();

    useEffect(() => {
        AsycStorage.getItem('user').then(user => {
            if(user) {
                navigation.navigate('Main', { user })
            }
        });

    },[])

    async function handleLogin(){
        const response = await api.post('/devs', {
            username
        });

        const { _id } =  response.data;
        await AsycStorage.setItem('user', _id);

        navigation.navigate('Main', { user: _id });
    }

    return (
        <KeyboardAvoidingView 
            behavior="padding"
            enabled={ Platform.OS === 'ios' }

            style={styles.container}>
            <Image source={logo} />
            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Digite o usuário do github"
                placeholderTextColor="#999"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>
                    Entrar
                </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    }, 
    input: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15,
        borderColor: '#DDD'
    },
    button: {
       height: 46,
       alignSelf: 'stretch',
       backgroundColor: '#DF4723',
       borderRadius: 4,
       marginTop: 10,
       justifyContent: 'center', 
       alignItems: 'center'
    },
    buttonText: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: 'bold'
    }
})