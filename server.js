const express = require('express')
const fs = require('fs')
const jsonParser = express.json();
const { v4: uuidV4 } = require('uuid');

const app = express()
const serverPort = 3001
const filePath = './pizzaList.json'

const getPizzasFunc = () => {
    const file = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(file)
}

const updatePizzasFunc = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

app.get('/api/pizzas', (req,res) => {

    const pizzaList = getPizzasFunc()
    res.send(pizzaList)
})

app.get('/api/pizzas/:id', ((req, res) => {

    const id = Number(req.params.id)
    const pizzaList = getPizzasFunc()

    const foundPizza = pizzaList.filter(pizza => pizza.id === id)[0]

    res.send(foundPizza)
}))

app.post('/api/pizzas', jsonParser, (req,res) => {
    if(!req.body) return res.status(400)

    const newPizza = {
        id: uuidV4(),
        title: req.body.title
    }

    const pizzaList = getPizzasFunc()
    const updatedPizzaList = [...pizzaList, newPizza]
    updatePizzasFunc(updatedPizzaList)

    res.send(updatedPizzaList)
})

app.put('/api/pizzas/:id', jsonParser, (req,res) => {
    const pizzaList = getPizzasFunc()
    const pizzaItem = req.body
    const updatedPizzaList = pizzaList.map(pizza => {
        if(pizza.id === pizzaItem.id) {
            return pizzaItem
        }
        return pizza
    })
    updatePizzasFunc(updatedPizzaList)

    res.send(updatedPizzaList)
})

app.delete('/api/pizzas/:id', (req,res) => {

    const id = Number(req.params.id)

    const pizzaList = getPizzasFunc()

    const updatedPizzaList = pizzaList.filter(pizza => pizza.id !== id)
    updatePizzasFunc(updatedPizzaList)
    res.send(updatedPizzaList)
})

app.listen(serverPort, () => {
    console.log(`Server on port ${serverPort}`)
})