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
