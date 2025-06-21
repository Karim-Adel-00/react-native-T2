import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('All');

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    const loadTodos = async () => {
      const storedTodos = await AsyncStorage.getItem('todos');
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    };
    loadTodos();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (title.trim()) {
      setTodos([{
        id: Date.now().toString(),
        title,
        description,
        status: 'active',
        createdAt: new Date().toLocaleString()
      }, ...todos]);
      setTitle('');
      setDescription('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, status: todo.status === 'active' ? 'done' : 'active' } : todo
    ));
  };

  const confirmDeleteTodo = (id) => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTodo(id) }
      ]
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearDoneTodos = () => {
    setTodos(todos.filter(todo => todo.status !== 'done'));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'All') return true;
    return todo.status === filter.toLowerCase();
  });

  const openEditModal = (todo) => {
    setCurrentTodo(todo);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setEditModalVisible(true);
  };

  const saveEditedTodo = () => {
    setTodos(todos.map(todo =>
      todo.id === currentTodo.id
        ? { ...todo, title: editTitle, description: editDescription }
        : todo
    ));
    setEditModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>TODO APP</Text>

      <TextInput
        style={styles.input}
        placeholder="Todo Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Todo Description"
        value={description}
        onChangeText={setDescription}
      />

      <Button title="Add Todo" onPress={addTodo} />

      <View style={styles.divider} />

      <View style={styles.filterContainer}>
        {['All', 'Active', 'Done'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.filterButton, filter === item && styles.selectedFilter]}
            onPress={() => setFilter(item)}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title="Clear Done Todos"
        color="#b00"
        onPress={clearDoneTodos}
      />

      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.todoItem,
              item.status === 'done' && styles.completedTodo
            ]}
            onPress={() => toggleTodo(item.id)}
            onLongPress={() => openEditModal(item)}
          >
            <View style={styles.todoHeader}>
              <Text style={styles.todoTitle}>{item.title}</Text>
              <TouchableOpacity onPress={() => confirmDeleteTodo(item.id)}>
                <Icon name="delete" size={20} color="red" />
              </TouchableOpacity>
            </View>
            <Text>{item.description}</Text>
            <Text style={styles.todoDate}>Created: {item.createdAt}</Text>
            <Text>Status: {item.status}</Text>
          </TouchableOpacity>
        )}
      />

      {/* تعديل المهمة */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Edit Todo</Text>
            <TextInput
              style={styles.input}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Edit title"
            />
            <TextInput
              style={styles.input}
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="Edit description"
            />
            <Button title="Save Changes" onPress={saveEditedTodo} />
            <View style={{ marginTop: 10 }}>
              <Button title="Cancel" color="gray" onPress={() => setEditModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eee',
  },
  header: {
    marginTop: 50,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  divider: {
    borderBottomColor: '#aaa',
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
  },
  selectedFilter: {
    backgroundColor: '#bbb',
  },
  todoItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  completedTodo: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  todoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todoTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  todoDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
});
