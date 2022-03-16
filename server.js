const express = require("express");
const { results: joyas } = require("./data/joyas.js");
const app = express();

const HATEOAS = () =>
    joyas.map((j) => {
        return {
            name: j.name,
            href: `http://localhost:3000/api/v1/joyas/${j.id}`,
        };
    });

const HATEOAS2 = () =>
    joyas.map((j) => {
        return {
            joya: j.name,
            value: j.value,
            src: `http://localhost:3000/api/v2/joyas/${j.id}`,
        };
    });

app.get("/api/v1/joyas", (req, res) => {
    return res.json(HATEOAS());
});

app.get("/api/v2/joyas", (req, res) => {
    const { value, page } = req.query;
    const datos = HATEOAS2();

    if (page) {
        return res.json(datos.slice(page * 2 - 2, page * 2));
    }

    if (value === "asc") {
        const order = datos.sort((a, b) => (a.value > b.value ? 1 : -1));
        return res.json(order);
    }

    if (value === "desc") {
        const order = datos.sort((a, b) => (a.value < b.value ? 1 : -1));
        return res.json(order);
    }

    return res.json(datos);
});

app.get("/api/v2/joyas/:id", (req, res) => {
    const { id } = req.params;
    const joya = { ...joyas.find((joya) => joya.id == id) };
    const { fields } = req.query;

    if (!joya) {
        return res.status(404).json({ msg: "Joya no encontrada" });
    }

    if (!fields || fields === "undefined") {
        return res.json(joya);
    }

    let arrayFields = fields.split(",");
    for (let propiedad in joya) {
        if (!arrayFields.includes(propiedad)) delete joya[propiedad];
    }

    return res.json(joya);
});

app.get("/api/v2/joyas/category/:category", (req, res) => {
    const { category } = req.params;
    const result = joyas.filter((joya) => joya.category == category);
    return res.json(result);
});

app.listen(3000, () => console.log("Your app listening on port 3000"));
