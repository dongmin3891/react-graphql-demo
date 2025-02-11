# GraphQL 데모 프로젝트

이 프로젝트는 GraphQL의 기본 개념과 사용 방법을 보여주는 데모 애플리케이션입니다. Todo 리스트를 통해 GraphQL의 다양한 기능을 실습해볼 수 있습니다.

## GraphQL이란?

GraphQL은 API를 위한 쿼리 언어이며 기존 REST API의 한계를 극복하기 위해 Facebook에서 만든 규격입니다.

### GraphQL의 주요 특징

1. **원하는 데이터만 요청 가능**

   - REST API는 엔드포인트가 반환하는 모든 데이터를 받아야 하지만,
   - GraphQL은 필요한 필드만 선택적으로 요청할 수 있습니다.

2. **단일 요청으로 필요한 모든 데이터 조회**

   - REST API는 여러 엔드포인트를 호출해야 할 수 있지만,
   - GraphQL은 하나의 요청으로 연관된 모든 데이터를 가져올 수 있습니다.

3. **타입 시스템**
   - 강력한 타입 시스템을 제공하여 API의 형태를 명확하게 정의합니다.
   - 개발 시 자동완성과 타입 검증이 가능합니다.

## 주요 개념

### 1. Query (조회)

```graphql
query GetTodos {
  todos(options: { paginate: { limit: 10 } }) {
    data {
      id
      title
      completed
    }
  }
}
```

### 2. Mutation (수정)

```graphql
mutation CreateTodo {
  createTodo(input: { title: "새로운 할일", completed: false }) {
    id
    title
    completed
  }
}
```

### 3. Subscription (실시간 구독)

```graphql
subscription OnTodoAdded {
  todoAdded {
    id
    title
    completed
  }
}
```

## React에서의 GraphQL 사용 방법

이 프로젝트에서는 Apollo Client를 사용하여 React에서 GraphQL을 사용하는 세 가지 방법을 보여줍니다:

### 1. useQuery Hook

```typescript
const { loading, error, data } = useQuery(GET_TODOS);
```

- 컴포넌트가 마운트될 때 자동으로 데이터를 가져옵니다.
- 캐시 관리와 로딩/에러 상태를 자동으로 처리합니다.

### 2. useLazyQuery Hook

```typescript
const [getTodos, { loading, data }] = useLazyQuery(GET_TODOS);
```

- 필요한 시점에 수동으로 쿼리를 실행할 수 있습니다.
- 사용자 인터랙션에 응답하여 데이터를 가져올 때 유용합니다.

### 3. client.query 직접 호출

```typescript
const { data } = await client.query({
  query: GET_TODOS,
  fetchPolicy: "network-only",
});
```

- Apollo Client를 직접 사용하여 더 세밀한 제어가 가능합니다.
- 캐시 정책을 직접 설정할 수 있습니다.

## Mutation 예시

데이터 수정을 위한 Mutation 사용 예시:

```typescript
const [createTodo] = useMutation(CREATE_TODO);

// Mutation 실행
await createTodo({
  variables: {
    title: "새로운 할일",
    completed: false,
  },
});
```

## 프로젝트 실행 방법

1. 의존성 설치:

```bash
npm install
```

2. 개발 서버 실행:

```bash
npm run dev
```

3. 브라우저에서 `http://localhost:5173` 접속

## 기술 스택

- React
- TypeScript
- Apollo Client
- Vite
- GraphQL

## 학습 포인트

1. GraphQL의 기본 개념 (Query, Mutation)
2. Apollo Client의 다양한 데이터 페칭 방법
3. TypeScript와 GraphQL의 타입 시스템 통합
4. React 컴포넌트에서 GraphQL 사용 패턴
5. 캐시 관리와 데이터 업데이트 전략
