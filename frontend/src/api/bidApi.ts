import { axiosClient } from './axiosClient'

export interface Bid {
  id: string
  amount: number
  proposal: string
  status: string
  freelancer: {
    id: string
    fullName?: string
  }
  task: {
    id: string
    title: string
  }
  createdAt?: string
}

export const bidApi = {
  async placeBid(taskId: string, payload: { amount: number; proposal: string }) {
    const { data } = await axiosClient.post<Bid>(`/tasks/${taskId}/bids`, payload)
    return data
  },

  async getBidsForTask(taskId: string) {
    const { data } = await axiosClient.get<Bid[]>(`/tasks/${taskId}/bids`)
    return data
  },

  async getMyBids() {
    const { data } = await axiosClient.get<Bid[]>('/bids/my')
    return data
  },

  async acceptBid(bidId: string) {
    const { data } = await axiosClient.put<Bid>(`/bids/${bidId}/accept`)
    return data
  },

  async rejectBid(bidId: string) {
    const { data } = await axiosClient.put<Bid>(`/bids/${bidId}/reject`)
    return data
  },
}

