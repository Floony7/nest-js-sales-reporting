import { AfterInsert, Entity, Column, PrimaryGeneratedColumn, AfterUpdate, AfterRemove } from "typeorm";
// import { Exclude } from "class-transformer";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    // @Exclude()
    password: string;

    @AfterInsert()
    logInsert() {
        console.log(`Inserted User with ${this.id}`);
    }

    @AfterUpdate()
    logUpdate() {
        console.log(`Updated User with Id: ${this.id}`);
    }

    @AfterRemove()
    logRemove() {
    console.log(`Removed User with Id: ${this.id}`);
    }
}