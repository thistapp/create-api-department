import axios from 'axios';

export async function fetchDummyData() {
  const response = await axios.get('https://dummyjson.com/users');
  const users = response.data.users;
  const result: any = {};
  // const departments = users.map((user:any) => user.company.department);
  // const arrDepartments = Array.from(new Set(departments));

  users.map((user: any) => {
    const { department } = user.company;
    const { gender, age, hair, address, firstName, lastName } = user;

    if (!result[department]) {
      result[department] = {
        male: 0,
        female: 0,
        ageRange: {
          min: Infinity,
          max: -Infinity
        },
        hair: {},
        addressUser: {}
      };
    }

    if (gender === 'male') {
      result[department].male++;
    } else if (gender === 'female') {
      result[department].female++;
    }

    result[department].ageRange.min = Math.min(result[department].ageRange.min, age);
    result[department].ageRange.max = Math.max(result[department].ageRange.max, age);

    if (hair && hair.color) {
      result[department].hair[hair.color] = (result[department].hair[hair.color] || 0) + 1;
    }

    result[department].addressUser[`${firstName}${lastName}`] = address.postalCode;
  });

  for (const department in result) {
    const { ageRange } = result[department];
    result[department].ageRange = `${ageRange.min}-${ageRange.max}`;
  }

  return result;
}