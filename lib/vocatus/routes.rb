module Vocatus
  module Datorum
    Routes = {
      '' => 'index',
      'cocktails' => {
          '' => 'cocktails/index',
          'new' => 'cocktails/new',
          ':cocktail_id' => 'cocktails/show',
          'recipes' => {
              '' => 'recipes/index',
              'new' => 'recipes/new',
              ':recipe_id' => 'recipes/show'
          }
      },
      'ingredients' => {
          '' => 'ingredients/index',
          'new' => 'ingredients/new',
          ':ingredient_id' => 'ingredients/show'
      },
      'spirits' => {
          '' => 'spirits/index',
          'new' => 'spirits/new',
          ':spirit_id' => 'spirits/show'
      },
      'mixers' => {
          '' => 'mixers/index',
          'new' => 'mixers/new',
          ':mixer_id' => 'mixers/show'
      },
      'users' => {
          '' => 'users/index',
          'new' => 'users/new',
          ':user_id' => 'users/show'
      },
      'sessions' => {
          '' => 'user_sessions/index',
          'new' => 'user_sessions/new',
          ':user_session_id' => 'user_sessions/show'
      },
      'register' => 'users/new',
      'login' => 'user_sessions/new',
      'user' => 'users/show',
      'session' => 'user_sessions/show'
    }
  end
end
