import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('All');

  // ✅ تحميل البيانات من التخزين عند بداية التطبيق
  useEffect(() => {
    const loadTodos = async () => {
      const storedTodos = await AsyncStorage.getItem('todos');
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    };
    loadTodos();
  }, []);

  // ✅ حفظ التودوز تلقائيًا عند التغيير
  useEffect(() => {
    AsyncStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

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
      todo.id === id ? { ...todo, status: todo.status === 'active' ? 'done' : 'active' } : todo
    ));
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

      {/* فلاتر الحالة */}
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

      {/* زر حذف المهام المنتهية */}
      <Button
        title="Clear Done Todos"
        color="#b00"
        onPress={clearDoneTodos}
      />

      {/* قائمة المهام */}
      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.todoItem, item.status === 'done' && styles.completedTodo]}
            onPress={() => toggleTodo(item.id)}
          >
            <View style={styles.todoHeader}>
              <Text style={styles.todoTitle}>{item.title}</Text>
              <TouchableOpacity onPress={() => deleteTodo(item.id)}>
                <Icon name="delete" size={20} color="red" />
              </TouchableOpacity>
            </View>
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
    borderColor: '#eee',
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
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
  completedTodo: {
    backgroundColor: '#f0f0f0',
    opacity: 0.7,
  },
});
