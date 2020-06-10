const countries = [
    {id: "DE", name: "Germany"},
    {id: "RO", name: "Romania"},
    {id: "ES", name: "Spain"},
    {id: "CH", name: "Switzerland"},
    {id: "UK", name: "United Kingdom"},
    {id: "USA", name: "United States"}
];

export default {
    getList() {
        return countries;
    },
    getListAsVM() {
        let result = [];
        countries.forEach(country => {
            result.push({label: country.name, value: country.id});
        });

        return result;
    },
    getCountry(id) {
        return countries.find(country => country.id === id).name;
    }
}