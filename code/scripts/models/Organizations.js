const organizations = [
    {id: "CACPP", name: "Cantonal Agency of Control of pharmacentric products (ZH)"},
    {id: "NMM", name: "National Medicine and Medication"}
];

export default {
    getList() {
        return organizations;
    },
    getListAsVM() {
        const result = [];
        organizations.forEach(organization => {
            result.push({label: organization.name, value: organization.id});
        });

        return result;
    },
    getOrganization(id) {
        return organizations.find(organization => organization.id === id).name;
    }
}