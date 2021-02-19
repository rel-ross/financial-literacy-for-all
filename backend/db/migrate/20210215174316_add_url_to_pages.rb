class AddUrlToPages < ActiveRecord::Migration[6.1]
  def change
    add_column :pages, :url, :string
  end
end
