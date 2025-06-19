import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Divider } from 'react-native';

export default function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('All');

  const addTodo = () => {
    if (title.trim()) {
      setTodos([...todos, {
        id: Date.now().toString(),
        title,
        description,
        status: 'active'
      }]);
      setTitle('');
      setDescription('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? {...todo, status: todo.status === 'active' ? 'done' : 'active'} : todo
    ));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'All') return true;
    return todo.status === filter.toLowerCase();
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>TODO APP</Text>
      
      {/* Input Fields */}
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
      
      {/* Filter Buttons */}
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
      
      {/* Todo List */}
      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.todoItem, item.status === 'done' && styles.completedTodo]}
            onPress={() => toggleTodo(item.id)}
          >
            <Text style={styles.todoTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Status: {item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ddd',
  },
  header: {
    marginTop:50,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  divider: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
  },
  selectedFilter: {
    backgroundColor: '#ddd',
  },
  todoItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 10,
    borderRadius: 5,
  },
  todoTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  completedTodo: {
    backgroundColor: '#f0f0f0',
    opacity: 0.7,
  },
});