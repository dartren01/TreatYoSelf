import React, {Component, Fragment} from "react"
import Cookies from "js-cookie"
import axios from "axios"
import {Form, Button} from "react-bootstrap"

import "./Category.css"

class Category extends Component {
    constructor(props){
        super(props)
        this.state = {
            categories:{},
            categories_budget:{},
            categories_monthly:{},
            new_category: "",
            budget_category:"",
            delete_category:"",
            budget:0,
            id: "",
            
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleAddCategory = this.handleAddCategory.bind(this)
        this.changebudgetCategory = this.changebudgetCategory.bind(this)
        this.getBudgetAxios = this.getBudgetAxios.bind(this)
        this.handleDeleteCategory = this.handleDeleteCategory.bind(this)
        this.updateCategoryAxios = this.updateCategoryAxios.bind(this)
    }

    componentDidMount = () => {
        console.log("Category componentDidMount")
        axios.get( "budget/category/get/", {headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${Cookies.get("token")}`
        }})
            .then(res => {
                    this.setState({
                        categories: res.data[0].categories,
                        categories_budget: res.data[0].categories_budget,
                        categories_monthly: res.data[0].categories_monthly,
                        budget_category: Object.keys(res.data[0].categories_budget)[0],
                        budget: res.data[0].categories_budget[Object.keys(res.data[0].categories_budget)[0]],
                        delete_category: Object.keys(res.data[0].categories_budget)[0],
                        id: res.data[0].id
                    })
                
            })
            .catch(err => {
                console.log("Catgory Error componentDidMount " + err)
            })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    handleAddCategory = (e) =>{
        e.preventDefault()
        console.log("Adding Category")
        if (this.state.new_category != "" && this.state.id != "" && !(this.state.new_category in this.state.categories)){
            this.setState({
                categories: {
                    ...this.state.categories,
                    [`${this.state.new_category}`]: 0
                },
                categories_budget: {
                    ...this.state.categories_budget,
                    [`${this.state.new_category}`]: 0
                },
                categories_monthly: {
                    ...this.state.categories_monthly,
                    [`${this.state.new_category}`]:{}
                },
                new_category: ""
            }, this.updateCategoryAxios)
            e.value = ""
            
        }

        else {
            console.log("Cannot Add New category")
        }


    }


    changebudgetCategory = (e) => {
        e.preventDefault
        // State may not change first
        this.setState({
            budget_category: e.target.value
        }, this.getBudgetAxios)
    }

    getBudgetAxios = () => {
        axios.get("budget/category/get/", {headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${Cookies.get("token")}`
        }})
            .then(res => {
                this.setState({
                    budget: res.data[0].categories_budget[this.state.budget_category]
                })
            })
    }

    handleAddBudget = (e) => {
        e.preventDefault
        this.setState({
            categories_budget: {
                ...this.state.categories_budget,
                [`${this.state.budget_category}`]:`${this.state.budget}`
            }
        }, this.updateCategoryAxios)
    }

    handleDeleteCategory = (e) => {
        e.preventDefault
        let tempCategories = this.state.categories
        let tempBudget = this.state.categories_budget
        let tempMonthly = this.state.categories_monthly
        delete tempCategories[this.state.delete_category]
        delete tempBudget[this.state.delete_category]
        delete tempMonthly[this.state.delete_category]
        this.setState({
            categories: tempCategories,
            categories_budget: tempBudget,
            categories_monthly: tempMonthly,
            budget_category: Object.keys(tempCategories)[0],
            delete_category: Object.keys(tempCategories)[0],
            budget: Object.values(tempBudget)[0]
            //Need to Update the States to match the categories
        }, this.updateCategoryAxios)

    }


    updateCategoryAxios = () => {
        console.log("Category Axios7")
        let categoryBody = {
            "categories":this.state.categories,
            "categories_budget": this.state.categories_budget,
            "categories_monthly": this.state.categories_monthly
        }
        axios.put(`budget/category/update/${this.state.id}`, categoryBody, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${Cookies.get("token")}`
            }
        })
            .then(res => {
                console.log("Category has been Updated")
            })
            .catch(err => {
                console.log("Error for category added" + err)
            })
    }




    render() {
        console.log("Category Render")
        return (
            <div>
                <h1>Category Page</h1>

                <Form className = "form-group name1 col-md-12">
                    <Form.Group controlId="formBasicCategory">
                        <Form.Label>Add Category</Form.Label>
                        <Form.Control 
                            type="new_category" 
                            name = "new_category"
                            placeholder="New Category"
                            value = {`${this.state.new_category}`}
                            onChange = {(e) => this.handleChange(e)} />
                    </Form.Group>
                    <Button className = "categoryButton"
                        variant="outline-secondary"
                        onClick = {(e) => this.handleAddCategory(e)}>
                        Add
                    </Button>
                </Form>

                <Form>
                    <div className = "budgetForm">
                        <div className = "form-group name1 col-md-6"> 
                            <Form.Group controlId="formCategoryBudget">
                                <Form.Label>Category Budget</Form.Label>
                                    <Form.Control 
                                            as="select"
                                            type = "budget_category"
                                            name = "budget_category"
                                            onChange = {(e) => this.changebudgetCategory(e)}>
                                        {Object.keys(this.state.categories_budget).map((cat) => 
                                            <Fragment key = {cat}>
                                                <option>{cat}</option>
                                            </Fragment>
                                        )}
                                    </Form.Control>
                            </Form.Group>
                        </div>
                        
                        <div className = "form-group name2 col-md-6">
                            <Form.Group controlId="formBasicBudget">
                            <Form.Label>Budget</Form.Label>
                            <Form.Control 
                                type="budget" 
                                name = "budget"
                                value = {`${this.state.budget}`}
                                onChange = {(e) => this.handleChange(e)} />
                            </Form.Group>
                            <Button 
                                className = "categoryButton"
                                variant="outline-secondary"
                                onClick = {(e) => this.handleAddBudget(e)}>
                                Change
                            </Button>
                        </div>
                    </div>
                    
                </Form>
               
                
                


                <div className = "form-group name1 col-md-12"> 
                    <Form.Group controlId="formCategoryDelete">
                        <Form.Label>Delete Category</Form.Label>
                            <Form.Control 
                                    as="select"
                                    type = "delete_category"
                                    name = "delete_category"
                                    onChange = {(e) => this.handleChange(e)}>
                                {Object.keys(this.state.categories_budget).map((cat) => 
                                    <Fragment key = {cat}>
                                        <option>{cat}</option>
                                    </Fragment>
                                )}
                            </Form.Control>
                        
                        <Button 
                            className = "categoryButton"
                            variant="outline-secondary"
                            onClick = {(e) => this.handleDeleteCategory(e)}>
                            Delete
                        </Button>
                    </Form.Group>
                </div>

            </div>


            
        )
    }
}

export default Category;