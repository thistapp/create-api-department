import axios, { AxiosResponse } from 'axios';

interface Props {
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  age: number;
  department: string | undefined;
  hair: {
    color: string;
  };
  address: {
    postalCode: string;
  };
}

interface DepartmentProps {
  male: number;
  female: number;
  ageRange: string;
  hair: Record<string, number>;
  addressUser: Record<string, string>;
}

interface GroupedUsers {
  [department: string]: DepartmentProps;
}

export async function fetchDummyData(): Promise<GroupedUsers> {
  const response: AxiosResponse<{ users: Props[] }> = await axios.get('https://dummyjson.com/users');
  const users: Props[] = response.data.users;

  const groupedUsers = users.reduce<GroupedUsers>((acc, item) => {
    const { department, gender, age, hair, firstName, lastName, address } = item;
    const fullName = `${firstName}${lastName}`;
    const departmentKey = department || "Department";

    if (!acc[departmentKey]) {
      acc[departmentKey] = {
        male: 0,
        female: 0,
        ageRange: '',
        hair: {},
        addressUser: {}
      };
    }

    if (gender === 'male') {
      acc[departmentKey].male++;
    } else {
      acc[departmentKey].female++;
    }

    const ages = (acc[departmentKey].ageRange.match(/\d+/g) || []).map(Number);
    const minAge = ages[0] ? Math.min(...ages, age) : age;
    const maxAge = ages[1] ? Math.max(...ages, age) : age;
    acc[departmentKey].ageRange = `${minAge}-${maxAge}`;

    if (hair.color) {
      acc[departmentKey].hair[hair.color] = (acc[departmentKey].hair[hair.color] || 0) + 1;
    }

    acc[departmentKey].addressUser[fullName] = address.postalCode;

    return acc;

  }, {} as GroupedUsers);

  return groupedUsers;
};
