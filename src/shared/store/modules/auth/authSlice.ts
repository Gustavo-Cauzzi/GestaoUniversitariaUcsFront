import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../../../@types/User";
import { api } from "../../../services/api";

const PREFIX = "app/auth";

export const getCurrentLoggedUser = createAsyncThunk<
  User | null | undefined,
  void
>(`${PREFIX}/getCurrentLoggedUser`, (_, { dispatch }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  if (!user || !token) {
    dispatch(logOut());
    return;
  }
  api.defaults.headers["Authorization"] = `Bearer ${token}`;
  return token ? (JSON.parse(user) as User) : null;
});

export const logIn = createAsyncThunk(
  `${PREFIX}/logIn`,
  async (payload: User) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay fake
    const response = await api.get("/api/v1/auth/login");
    api.defaults.headers["Authorization"] = `Bearer ${response.data.session}`;
    localStorage.setItem("token", response.data.session);
    localStorage.setItem("user", JSON.stringify(payload));
    return payload;
  }
);

export const logOut = createAsyncThunk<void, void>(
  `${PREFIX}/logOut`,
  async () => {
    api.defaults.headers["Authorization"] = ``;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
);

interface InitialState {
  isAuthenticated: boolean;
  user?: User;
}

export const authSlice = createSlice({
  name: PREFIX,
  initialState: {
    isAuthenticated: false,
    user: undefined,
  } as InitialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getCurrentLoggedUser.fulfilled, (state, action) => {
      state.isAuthenticated = !!action.payload;
      state.user = action.payload ?? undefined;
    });
    builder.addCase(logIn.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(logOut.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = undefined;
    });
  },
});

export default authSlice.reducer;
