from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)

# Initialize Firebase
cred = credentials.Certificate("path/to/your/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/recipes', methods=['GET'])
def get_recipes():
    recipes_ref = db.collection('recipes')
    recipes = [doc.to_dict() for doc in recipes_ref.stream()]
    return jsonify(recipes)

@app.route('/recipes/<id>', methods=['GET'])
def get_recipe(id):
    recipe_ref = db.collection('recipes').document(id)
    recipe = recipe_ref.get()
    return jsonify(recipe.to_dict())

@app.route('/shopping-list', methods=['POST'])
def generate_shopping_list():
    data = request.json
    selected_recipes = data['recipes']
    shopping_list = {}
    
    for recipe_id in selected_recipes:
        recipe_ref = db.collection('recipes').document(recipe_id)
        recipe = recipe_ref.get().to_dict()
        for ingredient in recipe['ingredients']:
            name = ingredient['name']
            quantity = ingredient['quantity']
            if name in shopping_list:
                shopping_list[name] += quantity
            else:
                shopping_list[name] = quantity

    return jsonify(shopping_list)

if __name__ == '__main__':
    app.run(debug=True)
