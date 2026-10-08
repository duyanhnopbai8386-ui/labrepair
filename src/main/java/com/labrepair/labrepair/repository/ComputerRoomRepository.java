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

import com.labrepair.labrepair.model.ComputerRoom;

@Repository
public class ComputerRoomRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<ComputerRoom> rowMapper = (rs, rowNum) -> new ComputerRoom(
            rs.getInt("id"),
            rs.getString("room_code"),
            rs.getString("room_name"),
            rs.getString("location"),
            rs.getInt("capacity")
    );

    public ComputerRoomRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<ComputerRoom> findAll() {
        String sql = "SELECT id, room_code, room_name, location, capacity FROM computer_rooms ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Optional<ComputerRoom> findById(Integer id) {
        String sql = "SELECT id, room_code, room_name, location, capacity FROM computer_rooms WHERE id = ?";
        try {
            ComputerRoom room = jdbcTemplate.queryForObject(sql, rowMapper, id);
            return Optional.ofNullable(room);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<ComputerRoom> findByCode(String roomCode) {
        String sql = "SELECT id, room_code, room_name, location, capacity FROM computer_rooms WHERE room_code = ?";
        try {
            ComputerRoom room = jdbcTemplate.queryForObject(sql, rowMapper, roomCode);
            return Optional.ofNullable(room);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public ComputerRoom save(ComputerRoom room) {
        String sql = "INSERT INTO computer_rooms (room_code, room_name, location, capacity) VALUES (?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, room.getRoomCode());
            ps.setString(2, room.getRoomName());
            ps.setString(3, room.getLocation());
            if (room.getCapacity() != null) {
                ps.setInt(4, room.getCapacity());
            } else {
                ps.setNull(4, java.sql.Types.INTEGER);
            }
            return ps;
        }, keyHolder);

        room.setId(Objects.requireNonNull(keyHolder.getKey()).intValue());
        return room;
    }

    public ComputerRoom update(ComputerRoom room) {
        String sql = "UPDATE computer_rooms SET room_code = ?, room_name = ?, location = ?, capacity = ? WHERE id = ?";
        jdbcTemplate.update(sql, room.getRoomCode(), room.getRoomName(), room.getLocation(), room.getCapacity(), room.getId());
        return room;
    }

    public boolean deleteById(Integer id) {
        String sql = "DELETE FROM computer_rooms WHERE id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }

    public boolean existsByCode(String roomCode) {
        String sql = "SELECT COUNT(*) FROM computer_rooms WHERE room_code = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, roomCode);
        return count != null && count > 0;
    }
}
