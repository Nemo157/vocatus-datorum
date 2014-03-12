$: << 'lib'

require 'bundler/setup'
require 'vocatus/api'
require 'vocatus/app'

map '/api' do
  run Vocatus::Datorum::Api
end
map '/' do
  run Vocatus::Datorum::App
end
