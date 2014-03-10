module Vocatus
  module Seed
    include Datorum

    entities = []

    entities << gin = Spirit.create({
      name: 'Gin',
      description: 'Gin is a spirit which derives its predominant flavour from juniper berries (Juniperus communis). From its earliest beginnings in the Middle Ages, gin has evolved over the course of a millennium from an herbal medicine to an object of commerce in the spirits industry. Today, the gin category is one of the most popular and widely distributed range of spirits, and is represented by products of various origins, styles, and flavor profiles that all revolve around juniper as a common ingredient.',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/DecaturGins.jpg/250px-DecaturGins.jpg',
      abv: 0.4
    })

    entities << Spirit.create({
      name: 'Dark Rum',
      description: 'Rum is a distilled alcoholic beverage made from sugarcane byproducts, such as molasses, or directly from sugarcane juice, by a process of fermentation and distillation. The distillate, a clear liquid, is then usually aged in oak barrels. Rum can be referred to in Spanish by descriptors such as ron viejo ("old rum") and ron añejo ("aged rum").',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Rum_display_in_liquor_store.jpg/350px-Rum_display_in_liquor_store.jpg',
      abv: 0.4
    })

    entities << Mixer.create({
      name: 'Tonic Water',
      description: '',
      image_url: ''
    })
    entities << Mixer.create({
      name: 'Cream',
      description: '',
      image_url: ''
    })
    entities << soda_water = Mixer.create({
      name: 'Soda Water',
      description: '',
      image_url: ''
    })
    entities << lemon_juice = Mixer.create({
      name: 'Lemon Juice',
      description: '',
      image_url: ''
    })
    entities << simple_syrup = Mixer.create({
      name: 'Simple Syrup',
      description: 'A basic sugar-and-water syrup used to make drinks at bars. Simple syrup is made by stirring granulated sugar into hot water in a saucepan until the sugar is dissolved and then cooling the solution. Generally, the ratio of sugar to water can range anywhere from 1:1 to 2:1. Simple syrup can be used as a sweetener. However, since it gels readily when pectin is added, its primary culinary use is as a base for fruit sauces, toppings and preserves.',
      image_url: ''
    })

    entities << tom_collins = Cocktail.create({
      name: 'Tom Collins',
      description: 'The Tom Collins is a Collins cocktail made from gin, lemon juice, sugar and carbonated water. First memorialized in writing in 1876 by "the father of American mixology" Jerry Thomas, this "gin and sparkling lemonade" drink typically is served in a Collins glass over ice.',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Tom_Collins_cocktail.jpg/220px-Tom_Collins_cocktail.jpg'
    })
    entities << Cocktail.create({
      name: 'Gin and Tonic',
      description: 'A gin and tonic is a highball cocktail made with gin and tonic water poured over ice. It is usually garnished with a slice or wedge of lime. The amount of gin varies according to taste. Suggested ratios of gin-to-tonic are 1:1, 1:2, 1:3, and 2:3.',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Gin_and_Tonic_with_ingredients.jpg/220px-Gin_and_Tonic_with_ingredients.jpg'
    })
    entities << Cocktail.create({
      name: 'Hot Buttered Rum',
      description: 'Hot buttered rum is a mixed drink containing rum, butter, hot water or cider, a sweetener, and various spices (usually cinnamon, nutmeg, and cloves). It is especially popular in the fall and winter and is traditionally associated with the holiday season. In the United States, the drink has a venerable history which dates back to colonial days.',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Hot_buttered_rum.jpg/220px-Hot_buttered_rum.jpg'
    })

    entities << iba_tom_collins = Recipe.create({
      name: 'IBA Tom Collins',
      cocktail: tom_collins
    })

    entities << QuantifiedIngredient.create({
      quantity: 45,
      ingredient: gin,
      recipe: iba_tom_collins
    })
    entities << QuantifiedIngredient.create({
      quantity: 30,
      ingredient: lemon_juice,
      recipe: iba_tom_collins
    })
    entities << QuantifiedIngredient.create({
      quantity: 15,
      ingredient: simple_syrup,
      recipe: iba_tom_collins
    })
    entities << QuantifiedIngredient.create({
      quantity: 60,
      ingredient: soda_water,
      recipe: iba_tom_collins
    })

    entities.each do |entity|
      puts "Failure saving #{entity}: #{entity.errors.to_h.to_json}" unless entity.save
    end
  end
end
