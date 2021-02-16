class RemoveWordFromPages < ActiveRecord::Migration[6.1]
  def change
    remove_column :pages, :word, :string
  end
end
