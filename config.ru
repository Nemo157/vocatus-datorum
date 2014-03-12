$:<<'lib'

require 'bundler/setup'
require 'sinatra'
require 'vocatus/app'

map '/api' do
  run Vocatus::Datorum::Api
end
