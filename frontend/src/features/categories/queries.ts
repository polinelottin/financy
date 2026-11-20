import { gql } from "@apollo/client";

export type Category = {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  color: string;
};

export type CategoryWithTotals = Category & {
  transactionCount: number;
  totalAmount: number;
};

export type CategoryInput = Omit<Category, "id">;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CategoryInput!) {
    createCategory(input: $input) {
      id
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $input: CategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

export const CATEGORIES = gql`
  query Categories {
    categories {
      id
      title
      description
      icon
      color
      transactionCount
      totalAmount
    }
  }
`;
