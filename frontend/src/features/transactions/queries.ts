import { gql } from "@apollo/client";
import type { TransactionType } from "@/lib/format";
import type { Category } from "@/features/categories/queries";

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  category: Category;
};

export type TransactionInput = Omit<Transaction, "id" | "category"> & { categoryId: string };

export const TRANSACTIONS = gql`
  query Transactions($filters: TransactionFilters) {
    transactions(filters: $filters) {
      total
      items {
        id
        description
        amount
        type
        date
        category {
          id
          title
          description
          icon
          color
        }
      }
    }
  }
`;

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: TransactionInput!) {
    createTransaction(input: $input) {
      id
    }
  }
`;

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: ID!, $input: TransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      id
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;
