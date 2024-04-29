import { ref } from 'vue';
import { cva, type VariantProps } from 'class-variance-authority';

export interface ISimpleTableData {
  city: string;
  totalOrders: string;
}

export type TextColorVariantProps = VariantProps<typeof tableTextColors>;
export type BackgroundVariantProps = VariantProps<typeof tableBackgroundColors>;
export interface IPaginatedTableData {
  picture: string;
  name: string;
  role: string;
  created: string;
  status: string;
  statusColor: 'green' | 'red' | 'yellow' | 'blue' | 'indigo' | 'purple' | 'pink' | 'gray' | 'orange';
}

export interface IWideTableData {
  name: string;
  email: string;
  title: string;
  title2: string;
  status: string;
  role: string;
}

const tableTextColors = cva('', {
  variants: {
    color: {
      green: 'text-green-500',
      red: 'text-red-500',
      yellow: 'text-yellow-500',
      blue: 'text-blue-500',
      indigo: 'text-indigo-500',
      purple: 'text-purple-500',
      pink: 'text-pink-500',
      gray: 'text-gray-500',
      orange: 'text-orange-500',
    },
  },
});

const tableBackgroundColors = cva('', {
  variants: {
    color: {
      green: 'bg-green-200',
      red: 'bg-red-200',
      yellow: 'bg-yellow-200',
      blue: 'bg-blue-200',
      indigo: 'bg-indigo-200',
      purple: 'bg-purple-200',
      pink: 'bg-pink-200',
      gray: 'bg-gray-200',
      orange: 'bg-orange-200',
    },
  },
});

export function useTableData() {
  const simpleTableData = ref<ISimpleTableData[]>([
    { city: 'New York', totalOrders: '200,120' },
    { city: 'Manchester', totalOrders: '632,310' },
    { city: 'London', totalOrders: '451,110' },
    { city: 'Madrid', totalOrders: '132,524' },
  ]);

  const paginatedTableData = ref<IPaginatedTableData[]>([
    {
      picture:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80',
      name: 'Vera Carpenter',
      role: 'Admin',
      created: 'Jan 21, 2020',
      status: 'Active',
      statusColor: 'green',
    },
    {
      picture:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80',
      name: 'Blake Bowman',
      role: 'Editor',
      created: 'Jan 01, 2020',
      status: 'Active',
      statusColor: 'green',
    },
    {
      picture:
        'https://images.unsplash.com/photo-1540845511934-7721dd7adec3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80',
      name: 'Dana Moore',
      role: 'Editor',
      created: 'Jan 10, 2020',
      status: 'Suspended',
      statusColor: 'orange',
    },
    {
      picture:
        'https://images.unsplash.com/photo-1522609925277-66fea332c575?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&h=160&w=160&q=80',
      name: 'Alonzo Cox',
      role: 'Admin',
      created: 'Jan 18, 2020',
      status: 'Inactive',
      statusColor: 'red',
    },
  ]);

  const wideTableData = ref<IWideTableData[]>(
    [...Array(10).keys()].map(() => ({
      name: 'John Doe',
      email: 'john@example.com',
      title: 'Software Engineer',
      title2: 'Web dev',
      status: 'Active',
      role: 'Owner',
    }))
  );

  return {
    simpleTableData,
    paginatedTableData,
    wideTableData,
    tableTextColors,
    tableBackgroundColors,
  };
}
