class AddContentToPages < ActiveRecord::Migration[6.1]
  def change
    add_column :pages, :content, :string
  end
end
