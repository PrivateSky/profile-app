const countries = [
    {id: "RO", name: "Romania"},
    {id: "DE", name: "Germany"},
    {id: "USA", name: "United States"},
    {id: "UK", name: "United Kingdom"},
    {id: "ES", name: "Spain"},
    {id: "CH", name: "Switzerland"},
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