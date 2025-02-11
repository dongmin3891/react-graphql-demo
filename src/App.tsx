import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useMutation,
  gql,
  useLazyQuery,
} from "@apollo/client";
import { useState } from "react";
import "./App.css";

const client = new ApolloClient({
  uri: "https://graphqlzero.almansi.me/api",
  cache: new InMemoryCache(),
});

const GET_TODOS = gql`
  query GetTodos {
    todos(options: { paginate: { limit: 10 } }) {
      data {
        id
        title
        completed
      }
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($title: String!, $completed: Boolean!) {
    createTodo(input: { title: $title, completed: $completed }) {
      id
      title
      completed
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: ID!, $completed: Boolean!) {
    updateTodo(id: $id, input: { completed: $completed }) {
      id
      completed
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

function TodoList() {
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const { loading, error, data, refetch } = useQuery(GET_TODOS);
  const [GetTodos, { loading: loading2, data: data2, error: error2 }] =
    useLazyQuery(GET_TODOS);
  const [clientQueryData, setClientQueryData] = useState<any>(null);
  const [createTodo] = useMutation(CREATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const [updateTodo] = useMutation(UPDATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const [deleteTodo] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const fetchTodos = async () => {
    try {
      const { data } = await client.query({
        query: GET_TODOS,
        fetchPolicy: "network-only", // 캐시 무시
      });
      setClientQueryData(data);
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  const fetchLazyTodos = async () => {
    GetTodos();
  };

  if (loading) return <p>로딩중...</p>;
  if (error) return <p>에러 발생: {error.message}</p>;

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      await createTodo({
        variables: {
          title: newTodoTitle,
          completed: false,
        },
      });
      setNewTodoTitle("");
    } catch (err) {
      console.error("Todo 생성 실패:", err);
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      await updateTodo({
        variables: {
          id: todo.id,
          completed: !todo.completed,
        },
      });
    } catch (err) {
      console.error("Todo 수정 실패:", err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo({
        variables: { id },
      });
    } catch (err) {
      console.error("Todo 삭제 실패:", err);
    }
  };

  return (
    <div>
      <h2>Todo 리스트 (GraphQL CRUD 예제)</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>데이터 조회 방법</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button onClick={() => refetch()}>useQuery로 다시 조회</button>
          <button onClick={fetchTodos}>client.query로 조회</button>
          <button onClick={fetchLazyTodos}>useLazyQuery로 조회</button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <h4>useQuery 결과:</h4>
            {loading ? (
              <p>로딩중...</p>
            ) : error ? (
              <p>에러: {error.message}</p>
            ) : (
              <pre
                style={{
                  background: "#f5f5f5",
                  padding: "10px",
                  borderRadius: "4px",
                  maxHeight: "200px",
                  overflow: "auto",
                }}
              >
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
          </div>

          <div>
            <h4>client.query 결과:</h4>
            {clientQueryData ? (
              <pre
                style={{
                  background: "#f5f5f5",
                  padding: "10px",
                  borderRadius: "4px",
                  maxHeight: "200px",
                  overflow: "auto",
                }}
              >
                {JSON.stringify(clientQueryData, null, 2)}
              </pre>
            ) : (
              <p>버튼을 클릭하여 데이터를 조회하세요</p>
            )}
          </div>

          <div>
            <h4>useLazyQuery 결과:</h4>
            {loading2 ? (
              <p>로딩중...</p>
            ) : error2 ? (
              <p>에러: {error2.message}</p>
            ) : data2 ? (
              <pre
                style={{
                  background: "#f5f5f5",
                  padding: "10px",
                  borderRadius: "4px",
                  maxHeight: "200px",
                  overflow: "auto",
                }}
              >
                {JSON.stringify(data2, null, 2)}
              </pre>
            ) : (
              <p>버튼을 클릭하여 데이터를 조회하세요</p>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleCreateTodo}>
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="새 할일 입력"
        />
        <button type="submit">추가</button>
      </form>

      <ul>
        {data.todos.data.map((todo: Todo) => (
          <li key={todo.id} style={{ margin: "10px 0" }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo)}
            />
            <span
              style={{
                marginLeft: "10px",
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.title}
            </span>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              style={{ marginLeft: "10px" }}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>GraphQL CRUD 테스트</h1>
        <TodoList />
      </div>
    </ApolloProvider>
  );
}

export default App;
