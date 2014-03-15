module Vocatus
  module Datorum
    module SlimHelpers
      def self.included app
        app.class_eval do
          enable :inline_templates
        end
      end

      def navbar_toggle target
        slim :navbar_toggle, locals: { target: target }
      end

      def ko call, &block
        slim :ko, locals: { call: call }, &block
      end

      def dropdown options={}, &block
        slim :dropdown, locals: {
          el: options[:el],
          text: options[:text],
          element: options[:element],
        }, &block
      end
    end
  end
end

__END__

@@ navbar_toggle
button.navbar-left.navbar-toggle type='button' data-toggle='collapse' data-target='#{target}'
  span.sr-only Toggle navigation
  span.icon-bar
  span.icon-bar
  span.icon-bar

@@ ko
/! ko #{{call}}
== yield
/! /ko

@@ dropdown
*{ tag: el, class: 'dropdown' }
  a.dropdown-toggle data-toggle='dropdown' href=''
    == element ? slim(element) : text
    b.caret
  ul.dropdown-menu
    == yield
