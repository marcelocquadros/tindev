import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import './Main.css';
import api from '../services/api';
import io from 'socket.io-client';
import itsamatch from '../assets/itsamatch.png';

export default function Main({ match, history}) {
    const [users, setUsers] = useState([]);
    const [ matchDev, setMatchDev] = useState();

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: { 'user': match.params.id }
            });
            setUsers(response.data)
        }

        loadUsers();
    }, [match.params.id]);

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user: match.params.id }
        });

        socket.on('match', dev => {
            setMatchDev(dev);
        });
    }, [match.params.id]);



    async function handleLike(id) {
        const response = await api.post(`/devs/${id}/likes`,{}, {
            headers: { user: match.params.id }
        })

        setUsers(users.filter( user => user._id !== id));
    }
    async function handleDislike(id) {
        const response = await api.post(`/devs/${id}/dislikes`,{}, {
            headers: { user: match.params.id }
        })

        setUsers(users.filter( user => user._id !== id));
    }

    return (
      <div className="main-container">
          <Link to="/">
            <img src={logo} alt="TindDev" />
          </Link>
            { users.length ? (
                <ul>
                    {users.map(user => (
                                <li key={user._id}>
                        <img src={user.avatar} alt="avatar" />
                        <footer>
                            <strong>{user.name}</strong>
                            <p>{user.bio} </p>
                        </footer>
                        <div className="buttons">
                            <button onClick={() => handleDislike(user._id)}>
                                <img src={dislike} alt="Dislike" />
                            </button>
                            <button onClick={() => handleLike(user._id)}>
                                <img src={like} alt="Like" />
                            </button>
                        </div>
                    </li>
                    ))};
                </ul>
            ) : (
              <div className="empty">
                  <h1>Acabou :(</h1>
              </div>
            )}

            { matchDev && (
                <div className="match-container">
                    <img src={itsamatch} alt="Match"/>
                    <img className="avatar" src={matchDev.avatar} alt="avatar"/>
                    <strong>{ matchDev.name }</strong>
                    <p>{ matchDev.bio }</p>
                    <button onClick={() => setMatchDev(null) }>FECHAR</button>
                </div>
            )}
      </div>   
    );
}