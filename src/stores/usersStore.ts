import { create } from 'zustand'
import { apiClient, API_ENDPOINTS } from '@/lib/api'
import {
  User,
  userListResponseSchema,
  UserListResponse,
} from '@/features/users/data/schema'

type UsersDialogType = 'invite' | 'add' | 'edit' | 'delete'

interface CreateUserData {
  first_name: string
  last_name: string
  username: string
  email: string
  password: string
  role: string
}

interface UpdateUserData extends Partial<User> {
  password?: string
  confirmPassword?: string
}

interface InviteUserData {
  email: string
  role: string
  desc?: string
}

interface UsersState {
  // State
  users: User[]
  currentUser: User | null
  isLoading: boolean
  error: Error | null

  // Pagination state
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }

  // Dialog state
  openDialog: UsersDialogType | null
  currentRow: User | null

  // Actions
  setUsers: (users: User[]) => void
  setCurrentUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: Error | null) => void
  setPagination: (pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }) => void

  // Dialog actions
  setOpenDialog: (dialog: UsersDialogType | null) => void
  setCurrentRow: (user: User | null) => void

  // API operations
  fetchUsers: (page?: number, pageSize?: number) => Promise<void>
  createUser: (userData: CreateUserData) => Promise<void>
  updateUser: (id: string, userData: UpdateUserData) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  inviteUser: (inviteData: InviteUserData) => Promise<void>
  resendVerificationEmail: (email: string) => Promise<void>

  // Reset state
  reset: () => void
}

export const useUsersStore = create<UsersState>()((set, get) => ({
  // Initial state
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  openDialog: null,
  currentRow: null,

  // State setters
  setUsers: (users) => set({ users }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setPagination: (pagination) => set({ pagination }),
  setOpenDialog: (openDialog) => set({ openDialog }),
  setCurrentRow: (currentRow) => set({ currentRow }),

  // API operations
  fetchUsers: async (page?: number, pageSize?: number) => {
    set({ isLoading: true, error: null })
    try {
      const currentState = get()
      const requestPage = page || currentState.pagination.currentPage
      const requestPageSize = pageSize || currentState.pagination.itemsPerPage

      const response = await apiClient.get<UserListResponse>(
        API_ENDPOINTS.users.list,
        {
          params: {
            page: requestPage,
            page_size: requestPageSize,
          },
        }
      )

      const validatedResponse = userListResponseSchema.parse(response)
      const users = validatedResponse.data
      const newPagination = {
        currentPage: validatedResponse.meta.current_page,
        totalPages: validatedResponse.meta.total_pages,
        totalItems: validatedResponse.meta.total_items,
        itemsPerPage: validatedResponse.meta.items_per_page,
      }

      set({
        users,
        isLoading: false,
        pagination: newPagination,
      })
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error : new Error('Failed to fetch users'),
      })
      throw error
    }
  },

  createUser: async (userData: CreateUserData) => {
    set({ isLoading: true, error: null })
    try {
      const newUser = await apiClient.post<User>(
        API_ENDPOINTS.auth.register,
        userData as unknown as Record<string, unknown>
      )
      const { users } = get()
      set({
        users: [...users, newUser],
        isLoading: false,
        openDialog: null,
      })
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error : new Error('Failed to create user'),
      })
      throw error
    }
  },

  updateUser: async (id: string, userData: UpdateUserData) => {
    set({ isLoading: true, error: null })
    try {
      const updatedUser = await apiClient.patch<User>(
        API_ENDPOINTS.users.update(id),
        userData as Record<string, unknown>
      )
      const { users } = get()
      const updatedUsers = users.map((user) =>
        user.id === id ? updatedUser : user
      )
      set({
        users: updatedUsers,
        isLoading: false,
        openDialog: null,
        currentRow: null,
      })
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error : new Error('Failed to update user'),
      })
      throw error
    }
  },

  deleteUser: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await apiClient.delete(API_ENDPOINTS.users.delete(id))
      const { users } = get()
      const filteredUsers = users.filter((user) => user.id !== id)
      set({
        users: filteredUsers,
        isLoading: false,
        openDialog: null,
        currentRow: null,
      })
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error : new Error('Failed to delete user'),
      })
      throw error
    }
  },

  inviteUser: async (inviteData: InviteUserData) => {
    set({ isLoading: true, error: null })
    try {
      await apiClient.post(
        '/users/invite',
        inviteData as unknown as Record<string, unknown>
      )
      set({
        isLoading: false,
        openDialog: null,
      })
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error : new Error('Failed to invite user'),
      })
      throw error
    }
  },

  resendVerificationEmail: async (email: string) => {
    set({ isLoading: true, error: null })
    try {
      await apiClient.post(API_ENDPOINTS.auth.resendVerification, { email })
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error
            : new Error('Failed to resend verification email'),
        openDialog: null,
      })
      throw error
    }
    set({
      isLoading: false,
      openDialog: null,
    })
  },

  // Reset state
  reset: () => {
    set({
      users: [],
      currentUser: null,
      isLoading: false,
      error: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      },
      openDialog: null,
      currentRow: null,
    })
  },
}))

// Convenience hook for users state
export const useUsers = () => {
  const store = useUsersStore()
  return {
    // State
    users: store.users,
    currentUser: store.currentUser,
    isLoading: store.isLoading,
    error: store.error,
    pagination: store.pagination,
    openDialog: store.openDialog,
    currentRow: store.currentRow,

    // Actions
    setUsers: store.setUsers,
    setCurrentUser: store.setCurrentUser,
    setLoading: store.setLoading,
    setError: store.setError,
    setPagination: store.setPagination,
    setOpenDialog: store.setOpenDialog,
    setCurrentRow: store.setCurrentRow,

    // API operations
    fetchUsers: store.fetchUsers,
    createUser: store.createUser,
    updateUser: store.updateUser,
    deleteUser: store.deleteUser,
    inviteUser: store.inviteUser,
    resendVerificationEmail: store.resendVerificationEmail,
    reset: store.reset,
  }
}
