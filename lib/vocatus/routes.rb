module Vocatus
  module Datorum
    Routes = {
      '' => 'index',
      'cocktails' => {
          '' => 'cocktails/index',
          'new' => 'cocktails/new',
          ':cocktail_id' => {
            '' => 'cocktails/show',
            'edit' => 'cocktails/edit',
            'recipes' => {
                '' => 'recipes/index',
                'new' => 'recipes/new',
                ':recipe_id' => 'recipes/show',
            },
          },
      },
      'ingredients' => {
          '' => 'ingredients/index',
          'new' => 'ingredients/new',
          ':ingredient_id' => {
            '' => 'ingredients/show',
            'edit' => 'ingredients/edit',
          },
      },
      'users' => {
          '' => 'users/index',
          'new' => 'users/new',
          ':user_id' => {
            '' => 'users/show',
            'edit' => 'users/edit',
          },
      },
      'sessions' => {
          '' => 'user_sessions/index',
          'new' => 'user_sessions/new',
          ':user_session_id' => {
            '' => 'user_sessions/show',
            'edit' => 'user_sessions/edit',
          },
      },
      'register' => 'users/new',
      'login' => 'user_sessions/new',
      'user' => 'users/show',
      'session' => 'user_sessions/show',
    }
  end
end
