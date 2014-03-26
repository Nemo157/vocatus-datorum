module Vocatus
  module Datorum
    class User
      def null
        self.id = 0
        self.email = 'none@invalid'
      end

      class << self
        def null_user
          @null_user ||= find_null_user
        end

        def find_null_user
          User.first(id: 0) || create_null_user
        end

        def create_null_user
          user = User.new
          user.null
          user.save!
          user
        end

        def current
          UserSession.current.user
        end
      end
    end

    class UserSession
      def null
        self.id = 0
        self.client_id = '00000000-0000-0000-0000-000000000000'
        self.user = User.null_user
      end

      class << self
        def null_session
          @null_session ||= find_null_session
        end

        def find_null_session
          UserSession.first(id: 0) || create_null_session
        end

        def create_null_session
          session = UserSession.new
          session.null
          session.save!
          session
        end

        def current
          Thread.current[:current_session] || null_session
        end

        def current= session
          Thread.current[:current_session] = session
        end
      end
    end

    module Authentication
      def self.included mod
        mod.before do
          if request.cookies['session_id']
            puts "Trying to find session for #{request.cookies['session_id']}"
            UserSession.current = UserSession.first(UserSession.client_id => request.cookies['session_id'])
          end
          puts "Current user is #{User.current.email}"
        end
        mod.after do
          UserSession.current = nil
        end
      end
    end
  end
end
