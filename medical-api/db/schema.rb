# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_12_16_161134) do
  create_table "person", force: :cascade do |t|
    t.integer "examination_number"
    t.string "family_name"
    t.string "family_name_kana"
    t.string "first_name"
    t.string "first_name_kana"
    t.integer "gender_type"
    t.date "birthday"
    t.string "email"
    t.string "password"
    t.string "zip", limit: 7
    t.text "address"
    t.datetime "applied"
    t.datetime "lastlogin"
    t.datetime "withdrawal_date"
    t.datetime "created"
    t.integer "created_user_id"
    t.datetime "modified"
    t.integer "modified_user_id"
    t.datetime "deleted"
    t.boolean "deleted_flag", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end
end
