package com.labrepair.labrepair.repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.labrepair.labrepair.model.EquipmentCategory;

@Repository
public class EquipmentCategoryRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<EquipmentCategory> rowMapper = (rs, rowNum) -> new EquipmentCategory(
            rs.getInt("id"),
            rs.getString("category_code"),
            rs.getString("category_name"),
            rs.getString("description")
    );

    public EquipmentCategoryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<EquipmentCategory> findAll() {
        String sql = "SELECT id, category_code, category_name, description FROM equipment_categories ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Optional<EquipmentCategory> findById(Integer id) {
        String sql = "SELECT id, category_code, category_name, description FROM equipment_categories WHERE id = ?";
        try {
            EquipmentCategory cat = jdbcTemplate.queryForObject(sql, rowMapper, id);
            return Optional.ofNullable(cat);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<EquipmentCategory> findByCode(String categoryCode) {
        String sql = "SELECT id, category_code, category_name, description FROM equipment_categories WHERE category_code = ?";
        try {
            EquipmentCategory cat = jdbcTemplate.queryForObject(sql, rowMapper, categoryCode);
            return Optional.ofNullable(cat);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public EquipmentCategory save(EquipmentCategory category) {
        String sql = "INSERT INTO equipment_categories (category_code, category_name, description) VALUES (?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, category.getCategoryCode());
            ps.setString(2, category.getCategoryName());
            ps.setString(3, category.getDescription());
            return ps;
        }, keyHolder);

        category.setId(Objects.requireNonNull(keyHolder.getKey()).intValue());
        return category;
    }

    public EquipmentCategory update(EquipmentCategory category) {
        String sql = "UPDATE equipment_categories SET category_code = ?, category_name = ?, description = ? WHERE id = ?";
        jdbcTemplate.update(sql, category.getCategoryCode(), category.getCategoryName(), category.getDescription(), category.getId());
        return category;
    }

    public boolean deleteById(Integer id) {
        String sql = "DELETE FROM equipment_categories WHERE id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }

    public boolean existsByCode(String categoryCode) {
        String sql = "SELECT COUNT(*) FROM equipment_categories WHERE category_code = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, categoryCode);
        return count != null && count > 0;
    }
}
